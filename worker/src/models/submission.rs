use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Submission {
    pub id: Uuid,
    pub problem_id: Uuid,
    pub user_id: Uuid,
    pub language: SubmissionLanguage,
    pub code: String,
    pub status: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "lowercase")]
pub enum SubmissionLanguage {
    #[serde(rename = "cpp")]
    Cpp,
    #[serde(rename = "python")]
    Python,
    #[serde(rename = "java")]
    Java,
    #[serde(rename = "rust")]
    Rust,
}

impl From<String> for SubmissionLanguage {
    fn from(s: String) -> Self {
        match s.to_lowercase().as_str() {
            "cpp" | "c++" => Self::Cpp,
            "python" | "py" => Self::Python,
            "java" => Self::Java,
            "rust" | "rs" => Self::Rust,
            _ => Self::Python, // Default fallback
        }
    }
}

impl SubmissionLanguage {
    pub fn file_extension(&self) -> &str {
        match self {
            Self::Cpp => "cpp",
            Self::Python => "py",
            Self::Java => "java",
            Self::Rust => "rs",
        }
    }

    pub fn source_filename(&self) -> &str {
        match self {
            Self::Cpp => "solution.cpp",
            Self::Python => "solution.py",
            Self::Java => "Solution.java",
            Self::Rust => "solution.rs",
        }
    }
}
