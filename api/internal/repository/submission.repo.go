package repository

import "github.com/klaus-creations/klaus-judge/api/internal/domain"

// SubmissionRepository defines the interface for submission operations.
type SubmissionRepository interface {
	Create(submission *domain.Submission) error
	FindByID(id uint) (*domain.Submission, error)
	FindByUserID(userID uint, pagination *domain.Pagination) ([]*domain.Submission, int64, error)
	FindAll(pagination *domain.Pagination, filters *domain.SubmissionFilters) ([]*domain.Submission, int64, error)
	Update(submission *domain.Submission) error
}
