export interface Problem {
    id: string;
    title: string;
    slug: string;
    description: string;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    time_limit: number;
    memory_limit: number;
    tags: string[];
    accepted_count: number;
    submission_count: number;
    test_cases: TestCase[];
}

export interface ProblemSummary {
    id: string;
    title: string;
    slug: string;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    tags: string[];
    accepted_count: number;
    submission_count: number;
}

export interface TestCase {
    id: string;
    input: string;
    expected_output: string;
    is_sample: boolean;
    points: number;
}

export interface CreateProblemRequest {
    title: string;
    description: string;
    difficulty: string;
    time_limit: number;
    memory_limit: number;
    tags: string[];
    test_cases: TestCaseDTO[];
}

export interface UpdateProblemRequest {
    title?: string;
    description?: string;
    difficulty?: string;
    time_limit?: number;
    memory_limit?: number;
    tags?: string[];
}

// DTO for creating test cases within a problem
export interface TestCaseDTO {
    input: string;
    expected_output: string;
    is_sample: boolean;
    points: number;
    order_index: number;
}
