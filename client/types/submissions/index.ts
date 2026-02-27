export interface Submission {
    id: string;
    verdict: string;
    execution_time: number;
    memory_used: number;
    score: number;
    tests_passed: number;
    tests_failed: number;
    code: string;
    language: string;
    submitted_at: string;
    judged_at: string | null;
    test_results: TestCaseResult[];
}

export interface SubmissionSummary {
    id: string;
    user_id?: string;
    problem_id?: string;
    problem_slug: string;
    verdict: string;
    submitted_at: string;
}

export interface TestCaseResult {
    id: string;
    verdict: string;
    execution_time: number;
    memory_used: number;
    output: string;
    error_message: string;
}

export interface SubmitRequest {
    slug: string;
    code: string;
    language: string;
}
