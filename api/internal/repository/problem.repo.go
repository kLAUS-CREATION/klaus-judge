package repository

import (
	"github.com/google/uuid"
	"github.com/klaus-creations/klaus-judge/api/internal/domain"
)

// ProblemRepository defines the interface for problem data operations.
type ProblemRepository interface {
	Create(problem *domain.Problem) error
	FindByID(id uuid.UUID) (*domain.Problem, error)
	FindBySlug(slug string) (*domain.Problem, error)
	FindAll(pagination *domain.Pagination, filters *domain.ProblemFilters) ([]*domain.Problem, int64, error)
	Update(problem *domain.Problem) error
	Delete(id uuid.UUID) error
	IncrementAcceptedCount(id uuid.UUID) error
	IncrementSubmissionCount(id uuid.UUID) error
}
