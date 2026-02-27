use anyhow::{Context, Result};
use tracing::{error, info, warn};
use uuid::Uuid;

use crate::config::{ExecutionConfig, WorkerConfig};
use crate::database::{self, DbPool};
use crate::models::{SubmissionResult, Verdict};
use crate::services::{executor::Executor, queue::QueueService};

pub struct JudgeWorker {
    queue: QueueService,
    db_pool: DbPool,
    executor: Executor,
    config: WorkerConfig,
}

impl JudgeWorker {
    pub fn new(
        queue: QueueService,
        db_pool: DbPool,
        worker_config: WorkerConfig,
        exec_config: ExecutionConfig,
    ) -> Self {
        Self {
            queue,
            db_pool,
            executor: Executor::new(exec_config),
            config: worker_config,
        }
    }

    pub async fn run(mut self) -> Result<()> {
        info!("🚀 Judge worker started");

        loop {
            match self.process_next_job().await {
                Ok(processed) => {
                    if !processed {
                        tokio::time::sleep(tokio::time::Duration::from_millis(
                            self.config.poll_interval_ms,
                        ))
                        .await;
                    }
                }
                Err(e) => {
                    error!("❌ Error processing job: {:#}", e);
                    tokio::time::sleep(tokio::time::Duration::from_secs(5)).await;
                }
            }
        }
    }

    async fn process_next_job(&mut self) -> Result<bool> {
        let submission_id = match self.queue.pop_job(5).await? {
            Some(id) => id,
            None => return Ok(false),
        };

        let id = Uuid::parse_str(&submission_id)
            .context("Invalid submission ID format")?;

        info!("⚖️  Judging submission {}", id);

        if let Err(e) = self.judge_submission(id).await {
            error!("Failed to judge submission {}: {:#}", id, e);
            let _ = database::submission::update_submission_status(
                &self.db_pool,
                id,
                "SYSTEM_ERROR",
            )
            .await;
        }

        Ok(true)
    }

    async fn judge_submission(&self, submission_id: Uuid) -> Result<()> {
        database::submission::update_submission_status(
            &self.db_pool,
            submission_id,
            "JUDGING",
        )
        .await?;

        let submission = database::submission::fetch_submission(&self.db_pool, submission_id)
            .await
            .context("Failed to fetch submission")?;

        let test_cases = database::test_cases::fetch_test_cases(&self.db_pool, submission.problem_id)
            .await
            .context("Failed to fetch test cases")?;

        if test_cases.is_empty() {
            warn!("⚠️  No test cases found for problem {}", submission.problem_id);
            database::submission::update_submission_verdict(
                &self.db_pool,
                submission_id,
                "SYSTEM_ERROR",
                0.0,
                0,
            )
            .await?;
            return Ok(());
        }

        let mut results = Vec::new();
        let mut total_time = 0.0;
        let mut max_memory = 0i64;
        let mut final_verdict = Verdict::Accepted;

        for test_case in test_cases {
            info!("🧪 Running test case {}", test_case.id);

            let mut result = self
                .executor
                .execute_test(
                    &submission.language,
                    &submission.code,
                    &test_case.input,
                    &test_case.expected_output,
                    test_case.time_limit.unwrap_or(5000) as u64,
                    test_case.memory_limit.unwrap_or(256),
                )
                .await?;

            result.test_case_id = test_case.id;
            total_time += result.execution_time_ms;
            max_memory = max_memory.max(result.memory_used_kb);

            if result.verdict != Verdict::Accepted && final_verdict == Verdict::Accepted {
                final_verdict = result.verdict.clone();
            }

            results.push(result);

            // Stop on first failure (optional optimization)
            if final_verdict != Verdict::Accepted {
                break;
            }
        }

        let submission_result = SubmissionResult {
            submission_id,
            final_verdict: final_verdict.clone(),
            total_time_ms: total_time,
            max_memory_kb: max_memory,
            test_results: results,
            compilation_output: None,
        };

        info!(
            "✅ Submission {} judged: {:?} ({} tests passed)",
            submission_id,
            final_verdict,
            submission_result.passed_tests()
        );

        database::submission::update_submission_verdict(
            &self.db_pool,
            submission_id,
            final_verdict.as_str(),
            total_time,
            max_memory,
        )
        .await?;

        Ok(())
    }
}
