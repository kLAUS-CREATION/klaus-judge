package gorm

import (
	"github.com/klaus-creations/klaus-judge/api/internal/domain"
	"gorm.io/gorm"
)

// SubmissionRepository implements the SubmissionRepository interface using GORM.
type SubmissionRepository struct {
	db *gorm.DB
}

// NewSubmissionRepository creates a new GORM-based submission repository.
func NewSubmissionRepository(db *gorm.DB) *SubmissionRepository {
	return &SubmissionRepository{db: db}
}

// Create inserts a new submission.
func (r *SubmissionRepository) Create(submission *domain.Submission) error {
	return r.db.Create(submission).Error
}

// FindByID retrieves a submission by ID.
func (r *SubmissionRepository) FindByID(id uint) (*domain.Submission, error) {
	var submission domain.Submission
	err := r.db.Preload("TestResults").First(&submission, id).Error
	if err != nil {
		return nil, err
	}
	return &submission, nil
}

// FindByUserID retrieves submissions for a user with pagination.
func (r *SubmissionRepository) FindByUserID(userID uint, pagination *domain.Pagination) ([]*domain.Submission, int64, error) {
	var submissions []*domain.Submission
	var total int64

	query := r.db.Model(&domain.Submission{}).Where("user_id = ?", userID)
	err := query.Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	err = query.Limit(pagination.Limit).Offset(pagination.Offset).Order("submitted_at DESC").Find(&submissions).Error
	if err != nil {
		return nil, 0, err
	}
	return submissions, total, nil
}

// FindAll retrieves all submissions with pagination and filters (for admin).
func (r *SubmissionRepository) FindAll(pagination *domain.Pagination, filters *domain.SubmissionFilters) ([]*domain.Submission, int64, error) {
	var submissions []*domain.Submission
	var total int64

	query := r.db.Model(&domain.Submission{})
	if filters != nil {
		if filters.ProblemID != 0 {
			query = query.Where("problem_id = ?", filters.ProblemID)
		}
		if filters.Verdict != "" {
			query = query.Where("verdict = ?", filters.Verdict)
		}
	}

	err := query.Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	err = query.Limit(pagination.Limit).Offset(pagination.Offset).Order("submitted_at DESC").Find(&submissions).Error
	if err != nil {
		return nil, 0, err
	}
	return submissions, total, nil
}

// Update updates a submission.
func (r *SubmissionRepository) Update(submission *domain.Submission) error {
	return r.db.Save(submission).Error
}
