package repository

import (
	"github.com/google/uuid"
	"github.com/klaus-creations/klaus-judge/api/internal/domain"
)

// SubmissionRepository defines the interface for submission operations.
type SubmissionRepository interface {
	Create(submission *domain.Submission) error
	FindByID(id uuid.UUID) (*domain.Submission, error)
	FindByUserID(userID uuid.UUID, pagination *domain.Pagination) ([]*domain.Submission, int64, error)
	FindAll(pagination *domain.Pagination, filters *domain.SubmissionFilters) ([]*domain.Submission, int64, error)
	Update(submission *domain.Submission) error
}
