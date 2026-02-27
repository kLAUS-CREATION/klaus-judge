use crate::database::DbPool;
use crate::models::Submission;
use anyhow::{Context, Result};
use tracing::{error, info};
use uuid::Uuid;

pub async fn fetch_submission(pool: &DbPool, submission_id: Uuid) -> Result<Submission> {
    info!("🔍 Fetching submission {}", submission_id);

    let submission = sqlx::query_as!(
        Submission,
        r#"
        SELECT
            id,
            problem_id,
            user_id,
            language as "language!",
            code as "code!",
            verdict as "status!"
        FROM submissions
        WHERE id = $1
        "#,
        submission_id
    )
    .fetch_one(pool)
    .await
    .context("Failed to fetch submission from database")?;

    Ok(submission)
}

pub async fn update_submission_status(
    pool: &DbPool,
    submission_id: Uuid,
    status: &str,
) -> Result<()> {
    info!("📝 Updating submission {} status to: {}", submission_id, status);

    let result = sqlx::query!(
        r#"
        UPDATE submissions
        SET verdict = $1
        WHERE id = $2
        "#,
        status,
        submission_id
    )
    .execute(pool)
    .await
    .context("Failed to update submission status")?;

    if result.rows_affected() == 0 {
        error!("⚠️  No rows updated for submission {}", submission_id);
    }

    Ok(())
}

pub async fn update_submission_verdict(
    pool: &DbPool,
    submission_id: Uuid,
    verdict: &str,
    execution_time: f64,
    memory_used: i64,
) -> Result<()> {
    info!("✅ Updating submission {} verdict to: {}", submission_id, verdict);

    sqlx::query!(
        r#"
        UPDATE submissions
        SET
            verdict = $1,
            execution_time = $2,
            memory_used = $3,
            judged_at = NOW()
        WHERE id = $4
        "#,
        verdict,
        execution_time as i32,
        memory_used as i32,
        submission_id
    )
    .execute(pool)
    .await
    .context("Failed to update submission verdict")?;

    Ok(())
}
