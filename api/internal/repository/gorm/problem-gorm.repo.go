package gorm

import (
	"github.com/klaus-creations/klaus-judge/api/internal/domain"
	"gorm.io/gorm"
)

// ProblemRepository implements the ProblemRepository interface using GORM.
type ProblemRepository struct {
	db *gorm.DB
}

// NewProblemRepository creates a new GORM-based problem repository.
func NewProblemRepository(db *gorm.DB) *ProblemRepository {
	return &ProblemRepository{db: db}
}

// Create inserts a new problem into the database.
func (r *ProblemRepository) Create(problem *domain.Problem) error {
	return r.db.Create(problem).Error
}

// FindByID retrieves a problem by ID.
func (r *ProblemRepository) FindByID(id uint) (*domain.Problem, error) {
	var problem domain.Problem
	err := r.db.First(&problem, id).Error
	if err != nil {
		return nil, err
	}
	return &problem, nil
}

// FindBySlug retrieves a problem by slug.
func (r *ProblemRepository) FindBySlug(slug string) (*domain.Problem, error) {
	var problem domain.Problem
	err := r.db.Where("slug = ?", slug).First(&problem).Error
	if err != nil {
		return nil, err
	}
	return &problem, nil
}

// FindAll retrieves all problems with pagination and filters.
func (r *ProblemRepository) FindAll(pagination *domain.Pagination, filters *domain.ProblemFilters) ([]*domain.Problem, int64, error) {
	var problems []*domain.Problem
	var total int64

	query := r.db.Model(&domain.Problem{})
	if filters != nil {
		if filters.Difficulty != "" {
			query = query.Where("difficulty = ?", filters.Difficulty)
		}
		if filters.Tags != "" {
			query = query.Where("tags LIKE ?", "%"+filters.Tags+"%")
		}
	}

	err := query.Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	err = query.Limit(pagination.Limit).Offset(pagination.Offset).Order("id DESC").Find(&problems).Error
	if err != nil {
		return nil, 0, err
	}
	return problems, total, nil
}

// Update updates an existing problem.
func (r *ProblemRepository) Update(problem *domain.Problem) error {
	return r.db.Save(problem).Error
}

// Delete removes a problem by ID.
func (r *ProblemRepository) Delete(id uint) error {
	return r.db.Delete(&domain.Problem{}, id).Error
}

// IncrementAcceptedCount increments the accepted count for a problem.
func (r *ProblemRepository) IncrementAcceptedCount(id uint) error {
	return r.db.Model(&domain.Problem{}).Where("id = ?", id).Update("accepted_count", gorm.Expr("accepted_count + 1")).Error
}

// IncrementSubmissionCount increments the submission count for a problem.
func (r *ProblemRepository) IncrementSubmissionCount(id uint) error {
	return r.db.Model(&domain.Problem{}).Where("id = ?", id).Update("submission_count", gorm.Expr("submission_count + 1")).Error
}
