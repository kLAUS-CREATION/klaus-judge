use anyhow::{Context, Result};
use serde::Deserialize;

#[derive(Debug, Clone, Deserialize)]
pub struct Settings {
    pub database: DatabaseConfig,
    pub redis: RedisConfig,
    pub worker: WorkerConfig,
    pub execution: ExecutionConfig,
    pub logging: LoggingConfig,
}

#[derive(Debug, Clone, Deserialize)]
pub struct DatabaseConfig {
    pub url: String,
    pub max_connections: u32,
}

#[derive(Debug, Clone, Deserialize)]
pub struct RedisConfig {
    pub url: String,
    pub queue_name: String,
}

#[derive(Debug, Clone, Deserialize)]
pub struct WorkerConfig {
    pub concurrency: usize,
    pub poll_interval_ms: u64,
}

#[derive(Debug, Clone, Deserialize)]
pub struct ExecutionConfig {
    pub work_dir: String,
    pub default_time_limit_seconds: f64,
    pub default_memory_limit_mb: i64,
    pub max_output_size_kb: usize,
    pub cleanup_on_success: bool,
}

#[derive(Debug, Clone, Deserialize)]
pub struct LoggingConfig {
    pub level: String,
    pub json_format: bool,
    pub file_path: Option<String>,
}

impl Settings {
    pub fn new() -> Result<Self> {
        // Load .env file if it exists
        dotenvy::dotenv().ok();

        let config = config::Config::builder()
            // Set defaults
            .set_default("database.max_connections", 5)?
            .set_default("worker.concurrency", 4)?
            .set_default("worker.poll_interval_ms", 1000)?
            .set_default("execution.work_dir", "/tmp/judge")?
            .set_default("execution.default_time_limit_seconds", 5.0)?
            .set_default("execution.default_memory_limit_mb", 256)?
            .set_default("execution.max_output_size_kb", 1024)?
            .set_default("execution.cleanup_on_success", true)?
            .set_default("logging.level", "info")?
            .set_default("logging.json_format", false)?
            .set_default("redis.queue_name", "judge_queue")?
            // Override with environment variables
            .add_source(
                config::Environment::default()
                    .separator("_")
                    .try_parsing(true),
            )
            .build()
            .context("Failed to build configuration")?;

        config
            .try_deserialize()
            .context("Failed to deserialize configuration")
    }

    pub fn validate(&self) -> Result<()> {
        // Add validation logic here
        if self.worker.concurrency == 0 {
            anyhow::bail!("Worker concurrency must be greater than 0");
        }

        if self.execution.default_time_limit_seconds <= 0.0 {
            anyhow::bail!("Time limit must be positive");
        }

        Ok(())
    }
}
