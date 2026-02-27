use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TestCase {
    pub id: Uuid,
    pub problem_id: Uuid,
    pub input: String,
    pub expected_output: String,
    pub time_limit: Option<i32>,
    pub memory_limit: Option<i64>,
    pub is_sample: bool,
}
