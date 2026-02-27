use anyhow::{Context, Result};
use std::fs;
use std::path::{Path, PathBuf};
use std::process::{Command, Stdio};
use std::time::{Duration, Instant};
use tracing::{error, info};
use uuid::Uuid;

use crate::config::ExecutionConfig;
use crate::models::{SubmissionLanguage, TestResult, Verdict};

pub struct Executor {
    config: ExecutionConfig,
}

impl Executor {
    pub fn new(config: ExecutionConfig) -> Self {
        Self { config }
    }

    pub async fn execute_test(
        &self,
        language: &SubmissionLanguage,
        code: &str,
        input: &str,
        expected_output: &str,
        time_limit_ms: u64,
        memory_limit_mb: i64,
    ) -> Result<TestResult> {
        let work_dir = self.create_work_dir()?;
        let filename = language.source_filename();
        let source_file = work_dir.join(filename);

        fs::write(&source_file, code)
            .context("Failed to write source file")?;

        let start = Instant::now();
        
        let output = match language {
            SubmissionLanguage::Python => {
                self.run_python(&work_dir, filename, input, time_limit_ms, memory_limit_mb).await?
            }
            SubmissionLanguage::Cpp => {
                self.run_cpp(&work_dir, filename, input, time_limit_ms, memory_limit_mb).await?
            }
            _ => return Ok(TestResult {
                test_case_id: Uuid::nil(),
                verdict: Verdict::SystemError,
                execution_time_ms: 0.0,
                memory_used_kb: 0,
                output: None,
                error_message: Some("Language not implemented".to_string()),
            }),
        };

        let elapsed = start.elapsed().as_secs_f64() * 1000.0;

        if self.config.cleanup_on_success {
            let _ = fs::remove_dir_all(&work_dir);
        }

        self.evaluate_output(output, expected_output, elapsed, time_limit_ms)
    }

    fn create_work_dir(&self) -> Result<PathBuf> {
        let dir = PathBuf::from(&self.config.work_dir)
            .join(format!("run_{}", Uuid::new_v4()));
        fs::create_dir_all(&dir).context("Failed to create work directory")?;
        Ok(dir)
    }

    async fn run_python(
        &self,
        work_dir: &Path,
        filename: &str,
        input: &str,
        timeout_ms: u64,
        memory_limit_mb: i64,
    ) -> Result<ExecutionOutput> {
        // Mount work_dir to /app
        // Run: python solution.py
        self.execute_docker(
            "klaus-judge-python:latest",
            &["python", filename],
            &[(work_dir.to_str().unwrap(), "/app")],
            input,
            timeout_ms,
            memory_limit_mb,
        ).await
    }

    async fn run_cpp(
        &self,
        work_dir: &Path,
        filename: &str,
        input: &str,
        timeout_ms: u64,
        memory_limit_mb: i64,
    ) -> Result<ExecutionOutput> {
        // 1. Compile
        // Mount work_dir to /app
        // Run: g++ -o solution solution.cpp
        let compile_output = self.execute_docker(
            "klaus-judge-cpp:latest",
            &["g++", "-o", "solution", filename],
            &[(work_dir.to_str().unwrap(), "/app")],
            "",
            10000, // 10s compile timeout
            1024, // 1GB compile memory
        ).await?;

        if compile_output.exit_code != 0 {
            return Ok(compile_output);
        }

        // 2. Execute
        // Run: ./solution
        self.execute_docker(
            "klaus-judge-cpp:latest",
            &["./solution"],
            &[(work_dir.to_str().unwrap(), "/app")],
            input,
            timeout_ms,
            memory_limit_mb,
        ).await
    }

    async fn execute_docker(
        &self,
        image: &str,
        cmd: &[&str],
        bind_mounts: &[(&str, &str)], // host_path, container_path
        input: &str,
        timeout_ms: u64,
        memory_limit_mb: i64,
    ) -> Result<ExecutionOutput> {
        let mut args: Vec<String> = vec![
            "run".to_string(),
            "--rm".to_string(),
            "--network=none".to_string(),
        ];
        
        args.push(format!("--memory={}m", memory_limit_mb));
        args.push("--cpus=1".to_string());

        for (host, container) in bind_mounts {
            args.push("-v".to_string());
            args.push(format!("{}:{}:rw", host, container));
        }

        args.push(image.to_string());
        for c in cmd {
            args.push(c.to_string());
        }

        let output = tokio::time::timeout(
            Duration::from_millis(timeout_ms),
            tokio::task::spawn_blocking({
                let input = input.to_string();
                let args = args.clone();
                move || {
                    Command::new("docker")
                        .args(args)
                        .stdin(Stdio::piped())
                        .stdout(Stdio::piped())
                        .stderr(Stdio::piped())
                        .spawn()
                        .and_then(|mut child| {
                            use std::io::Write;
                            if let Some(mut stdin) = child.stdin.take() {
                                let _ = stdin.write_all(input.as_bytes());
                            }
                            child.wait_with_output()
                        })
                }
            }),
        )
        .await;

        match output {
            Ok(Ok(Ok(out))) => Ok(ExecutionOutput {
                stdout: String::from_utf8_lossy(&out.stdout).to_string(),
                stderr: String::from_utf8_lossy(&out.stderr).to_string(),
                exit_code: out.status.code().unwrap_or(-1),
                timed_out: false,
            }),
            Ok(Ok(Err(e))) => {
                error!("Docker execution failed: {}", e);
                Ok(ExecutionOutput {
                    stdout: String::new(),
                    stderr: format!("Execution error: {}", e),
                    exit_code: -1,
                    timed_out: false,
                })
            }
            Ok(Err(e)) => {
                error!("Task join error: {}", e);
                Ok(ExecutionOutput {
                    stdout: String::new(),
                    stderr: "Internal error".to_string(),
                    exit_code: -1,
                    timed_out: false,
                })
            }
            Err(_) => Ok(ExecutionOutput {
                stdout: String::new(),
                stderr: "Time limit exceeded".to_string(),
                exit_code: -1,
                timed_out: true,
            }),
        }
    }

    fn evaluate_output(
        &self,
        output: ExecutionOutput,
        expected: &str,
        elapsed_ms: f64,
        time_limit_ms: u64,
    ) -> Result<TestResult> {
        if output.timed_out || elapsed_ms > time_limit_ms as f64 {
            return Ok(TestResult {
                test_case_id: Uuid::nil(),
                verdict: Verdict::TimeLimitExceeded,
                execution_time_ms: elapsed_ms,
                memory_used_kb: 0,
                output: Some(output.stdout),
                error_message: Some("Time limit exceeded".to_string()),
            });
        }

        if output.exit_code != 0 {
            return Ok(TestResult {
                test_case_id: Uuid::nil(),
                verdict: Verdict::RuntimeError,
                execution_time_ms: elapsed_ms,
                memory_used_kb: 0,
                output: Some(output.stdout.clone()),
                error_message: Some(output.stderr),
            });
        }

        let actual = output.stdout.trim();
        let expected = expected.trim();

        let verdict = if actual == expected {
            Verdict::Accepted
        } else {
            Verdict::WrongAnswer
        };

        let error_msg = if verdict == Verdict::Accepted {
            None
        } else {
            Some(format!("Expected:\n{}\n\nGot:\n{}", expected, actual))
        };

        Ok(TestResult {
            test_case_id: Uuid::nil(),
            verdict,
            execution_time_ms: elapsed_ms,
            memory_used_kb: 0,
            output: Some(output.stdout),
            error_message: error_msg,
        })
    }
}

pub struct ExecutionOutput {
    pub stdout: String,
    pub stderr: String,
    pub exit_code: i32,
    pub timed_out: bool,
}
