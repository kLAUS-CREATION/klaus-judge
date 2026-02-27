use thiserror::Error;

pub type Result<T> = std::result::Result<T, JudgeError>;

#[derive(Error, Debug)]
pub enum JudgeError {
    #[error("Database error: {0}")]
    Database(#[from] sqlx::Error),

    #[error("Redis error: {0}")]
    Redis(#[from] redis::RedisError),

    #[error("Compilation failed: {0}")]
    Compilation(String),

    #[error("Execution failed: {0}")]
    Execution(String),

    #[error("I/O error: {0}")]
    Io(#[from] std::io::Error),

    #[error("Configuration error: {0}")]
    Config(String),

    #[error("Serialization error: {0}")]
    Serialization(#[from] serde_json::Error),

    #[error("Internal error: {0}")]
    Internal(String),
}
