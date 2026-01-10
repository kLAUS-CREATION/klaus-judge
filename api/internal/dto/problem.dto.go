package dto

import (
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/klaus-creations/klaus-judge/api/internal/domain"
)

type CreateProblemRequest struct {
	Title       string        `json:"title" binding:"required"`
	Description string        `json:"description" binding:"required"`
	Difficulty  string        `json:"difficulty" binding:"required"`
	TimeLimit   int           `json:"time_limit" binding:"required"`
	MemoryLimit int           `json:"memory_limit" binding:"required"`
	Tags        []string      `json:"tags"`
	TestCases   []TestCaseDTO `json:"test_cases"`
}

type UpdateProblemRequest struct {
	Title       string   `json:"title"`
	Description string   `json:"description"`
	Difficulty  string   `json:"difficulty"`
	TimeLimit   int      `json:"time_limit"`
	MemoryLimit int      `json:"memory_limit"`
	Tags        []string `json:"tags"`
}

type ProblemResponse struct {
	ID              uuid.UUID     `json:"id"`
	Title           string        `json:"title"`
	Slug            string        `json:"slug"`
	Description     string        `json:"description"`
	Difficulty      string        `json:"difficulty"`
	TimeLimit       int           `json:"time_limit"`
	MemoryLimit     int           `json:"memory_limit"`
	Tags            []string      `json:"tags"`
	AcceptedCount   int           `json:"accepted_count"`
	SubmissionCount int           `json:"submission_count"`
	TestCases       []TestCaseDTO `json:"test_cases"`
}

type ProblemSummaryDTO struct {
	ID              uuid.UUID `json:"id"`
	Title           string    `json:"title"`
	Slug            string    `json:"slug"`
	Difficulty      string    `json:"difficulty"`
	Tags            []string  `json:"tags"`
	AcceptedCount   int       `json:"accepted_count"`
	SubmissionCount int       `json:"submission_count"`
}

type ProblemListResponse struct {
	Problems []ProblemSummaryDTO `json:"problems"`
	Total    int64               `json:"total"`
	Page     int                 `json:"page"`
	Limit    int                 `json:"limit"`
}

type TestCaseRequest struct {
	Input          string `json:"input" binding:"required"`
	ExpectedOutput string `json:"expected_output" binding:"required"`
	IsSample       bool   `json:"is_sample"`
	Points         int    `json:"points"`
	OrderIndex     int    `json:"order_index"`
}

type TestCaseDTO struct {
	ID             uuid.UUID `json:"id"`
	Input          string    `json:"input"`
	ExpectedOutput string    `json:"expected_output"`
	IsSample       bool      `json:"is_sample"`
	Points         int       `json:"points"`
}

type PaginationRequest struct {
	Page  int `form:"page,default=0"`
	Limit int `form:"limit,default=20"`
}

type ProblemFilters struct {
	Difficulty string `form:"difficulty"`
	Tags       string `form:"tags"`
}

func ParsePagination(c *gin.Context) *PaginationRequest {
	page, _ := strconv.Atoi(c.Query("page"))
	limit, _ := strconv.Atoi(c.Query("limit"))
	if limit == 0 {
		limit = 20
	}
	return &PaginationRequest{Page: page, Limit: limit}
}

func ParseProblemFilters(c *gin.Context) *ProblemFilters {
	return &ProblemFilters{
		Difficulty: c.Query("difficulty"),
		Tags:       c.Query("tags"),
	}
}

func ProblemResponseFromDomain(p *domain.Problem) *ProblemResponse {
	var tags []string
	if p.Tags != "" {
		tags = strings.Split(p.Tags, ",")
	} else {
		tags = []string{}
	}

	return &ProblemResponse{
		ID:              p.ID,
		Title:           p.Title,
		Slug:            p.Slug,
		Description:     p.Description,
		Difficulty:      p.Difficulty,
		TimeLimit:       p.TimeLimit,
		MemoryLimit:     p.MemoryLimit,
		Tags:            tags,
		AcceptedCount:   p.AcceptedCount,
		SubmissionCount: p.SubmissionCount,
		TestCases:       []TestCaseDTO{}, // Test cases are usually fetched separately or need more context
	}
}
