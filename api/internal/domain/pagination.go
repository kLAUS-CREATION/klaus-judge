package domain

type Pagination struct {
	Limit  int
	Offset int
}

type ProblemFilters struct {
	Difficulty string
	Tags       string
}

type SubmissionFilters struct {
	ProblemID uint
	Verdict   string
}
