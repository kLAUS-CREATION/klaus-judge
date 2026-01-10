package dto

import (
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type SubmitRequest struct {
	Slug     string `json:"slug" binding:"required"`
	Code     string `json:"code" binding:"required"`
	Language string `json:"language" binding:"required"`
}

type SubmissionResponse struct {
	ID            uuid.UUID           `json:"id"`
	Verdict       string              `json:"verdict"`
	ExecutionTime int                 `json:"execution_time"`
	MemoryUsed    int                 `json:"memory_used"`
	Score         float64             `json:"score"`
	TestsPassed   int                 `json:"tests_passed"`
	TestsFailed   int                 `json:"tests_failed"`
	Code          string              `json:"code"`
	Language      string              `json:"language"`
	SubmittedAt   time.Time           `json:"submitted_at"`
	JudgedAt      *time.Time          `json:"judged_at"`
	TestResults   []TestCaseResultDTO `json:"test_results"`
}

type SubmissionSummaryDTO struct {
	ID          uuid.UUID `json:"id"`
	UserID      uuid.UUID `json:"user_id,omitempty"`
	ProblemID   uuid.UUID `json:"problem_id,omitempty"`
	ProblemSlug string    `json:"problem_slug"`
	Verdict     string    `json:"verdict"`
	SubmittedAt time.Time `json:"submitted_at"`
}

type SubmissionListResponse struct {
	Submissions []SubmissionSummaryDTO `json:"submissions"`
	Total       int64                  `json:"total"`
	Page        int                    `json:"page"`
	Limit       int                    `json:"limit"`
}

type TestCaseResultDTO struct {
	ID            uuid.UUID `json:"id"`
	Verdict       string    `json:"verdict"`
	ExecutionTime int       `json:"execution_time"`
	MemoryUsed    int       `json:"memory_used"`
	Output        string    `json:"output"`
	ErrorMessage  string    `json:"error_message"`
}

type SubmissionFilters struct {
	ProblemID uuid.UUID `form:"problem_id"`
	Verdict   string    `form:"verdict"`
}

func ParseSubmissionFilters(c *gin.Context) *SubmissionFilters {
	problemIDStr := c.Query("problem_id")
	problemID := uuid.Nil
	if problemIDStr != "" {
		parsed, err := uuid.Parse(problemIDStr)
		if err == nil {
			problemID = parsed
		}
	}

	return &SubmissionFilters{
		ProblemID: problemID,
		Verdict:   c.Query("verdict"),
	}
}
