package domain

import "github.com/google/uuid"

type Pagination struct {
	Limit  int
	Offset int
}

type ProblemFilters struct {
	Difficulty string
	Tags       string
}

type SubmissionFilters struct {
	ProblemID uuid.UUID
	Verdict   string
}
