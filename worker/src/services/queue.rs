use anyhow::{Context, Result};
use redis::aio::ConnectionManager;
use redis::AsyncCommands;
use tracing::{info, warn};

pub struct QueueService {
    conn: ConnectionManager,
    queue_name: String,
}

impl QueueService {
    pub async fn new(config: &crate::config::RedisConfig) -> Result<Self> {
        let client = redis::Client::open(config.url.as_str())
            .context("Failed to create Redis client")?;
        
        let conn = ConnectionManager::new(client)
            .await
            .context("Failed to connect to Redis")?;

        Ok(Self {
            conn,
            queue_name: config.queue_name.clone(),
        })
    }

    pub async fn pop_job(&mut self, timeout_secs: u64) -> Result<Option<String>> {
        let result: Option<Vec<String>> = self
            .conn
            .brpop(&self.queue_name, (timeout_secs as usize) as f64)
            .await
            .context("Failed to pop from queue")?;

        match result {
            Some(values) if values.len() >= 2 => {
                let submission_id = values[1].clone();
                info!("📥 Popped submission: {}", submission_id);
                Ok(Some(submission_id))
            }
            _ => {
                warn!("⏰ Queue timeout, no jobs available");
                Ok(None)
            }
        }
    }

    pub async fn get_queue_length(&mut self) -> Result<i64> {
        self.conn
            .llen(&self.queue_name)
            .await
            .context("Failed to get queue length")
    }
}
