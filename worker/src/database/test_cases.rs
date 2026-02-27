use crate::database::DbPool;
use crate::models::TestCase;
use anyhow::{Context, Result};
use tracing::info;
use uuid::Uuid;

pub async fn fetch_test_cases(pool: &DbPool, problem_id: Uuid) -> Result<Vec<TestCase>> {
    info!("📋 Fetching test cases for problem {}", problem_id);

    let test_cases = sqlx::query_as!(
        TestCase,
        r#"
        SELECT
            id,
            problem_id,
            input,
            expected_output,
            CAST(NULL AS integer) as time_limit,
            CAST(NULL AS bigint) as memory_limit,
            is_sample as "is_sample!"
        FROM test_cases
        WHERE problem_id = $1
        ORDER BY order_index ASC
        "#,
        problem_id
    )
    .fetch_all(pool)
    .await
    .context("Failed to fetch test cases from database")?;

    info!("✅ Found {} test cases", test_cases.len());

    Ok(test_cases)
}
