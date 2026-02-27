mod config;
mod database;
mod errors;
mod models;
mod services;
mod utils;

use anyhow::Result;
use tracing::info;

#[tokio::main]
async fn main() -> Result<()> {
    utils::logger::init()?;

    info!("Starting Online Judge Worker v{}", env!("CARGO_PKG_VERSION"));

    let settings = config::Settings::new()?;
    info!("Configuration loaded successfully");

    let db_pool = database::create_pool(&settings.database.url, settings.database.max_connections).await?;
    info!("Database connection pool established");

    let queue_service = services::queue::QueueService::new(&settings.redis).await?;
    info!("Redis connection established");

    let worker = services::judge::JudgeWorker::new(
        queue_service,
        db_pool,
        settings.worker,
        settings.execution,
    );

    info!("Worker initialized, starting main loop...");
    worker.run().await?;

    Ok(())
}
