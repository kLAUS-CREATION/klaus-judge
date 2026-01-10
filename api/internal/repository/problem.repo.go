package repository

import "github.com/klaus-creations/klaus-judge/api/internal/domain"

// ProblemRepository defines the interface for problem data operations.
type ProblemRepository interface {
	Create(problem *domain.Problem) error
	FindByID(id uint) (*domain.Problem, error)
	FindBySlug(slug string) (*domain.Problem, error)
	FindAll(pagination *domain.Pagination, filters *domain.ProblemFilters) ([]*domain.Problem, int64, error)
	Update(problem *domain.Problem) error
	Delete(id uint) error
	IncrementAcceptedCount(id uint) error
	IncrementSubmissionCount(id uint) error
}
