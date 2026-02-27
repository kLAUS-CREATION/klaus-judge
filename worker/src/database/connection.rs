use anyhow::{Context, Result};
use sqlx::postgres::{PgPool, PgPoolOptions};
use tracing::info;

pub type DbPool = PgPool;

pub async fn create_pool(database_url: &str, max_connections: u32) -> Result<DbPool> {
    info!("📊 Connecting to PostgreSQL...");

    let pool = PgPoolOptions::new()
        .max_connections(max_connections)
        .acquire_timeout(std::time::Duration::from_secs(10))
        .connect(database_url)
        .await
        .context("Failed to connect to PostgreSQL")?;

    // Test the connection
    sqlx::query("SELECT 1")
        .execute(&pool)
        .await
        .context("Failed to execute test query")?;

    info!("✅ PostgreSQL connection pool established (max: {})", max_connections);

    Ok(pool)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_database_connection() {
        dotenvy::dotenv().ok();
        let database_url = std::env::var("DATABASE_URL").unwrap();
        let pool = create_pool(&database_url, 2).await;
        assert!(pool.is_ok());
    }
}
