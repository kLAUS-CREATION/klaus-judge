use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum Verdict {
    Accepted,
    WrongAnswer,
    TimeLimitExceeded,
    MemoryLimitExceeded,
    RuntimeError,
    CompilationError,
    SystemError,
}

impl Verdict {
    pub fn as_str(&self) -> &str {
        match self {
            Self::Accepted => "ACCEPTED",
            Self::WrongAnswer => "WRONG_ANSWER",
            Self::TimeLimitExceeded => "TIME_LIMIT_EXCEEDED",
            Self::MemoryLimitExceeded => "MEMORY_LIMIT_EXCEEDED",
            Self::RuntimeError => "RUNTIME_ERROR",
            Self::CompilationError => "COMPILATION_ERROR",
            Self::SystemError => "SYSTEM_ERROR",
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TestResult {
    pub test_case_id: Uuid,
    pub verdict: Verdict,
    pub execution_time_ms: f64,
    pub memory_used_kb: i64,
    pub output: Option<String>,
    pub error_message: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SubmissionResult {
    pub submission_id: Uuid,
    pub final_verdict: Verdict,
    pub total_time_ms: f64,
    pub max_memory_kb: i64,
    pub test_results: Vec<TestResult>,
    pub compilation_output: Option<String>,
}

impl SubmissionResult {
    pub fn passed_tests(&self) -> usize {
        self.test_results
            .iter()
            .filter(|t| t.verdict == Verdict::Accepted)
            .count()
    }

    pub fn total_tests(&self) -> usize {
        self.test_results.len()
    }
}
