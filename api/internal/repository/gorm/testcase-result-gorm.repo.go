package gorm

import (
	"github.com/klaus-creations/klaus-judge/api/internal/domain"
	"gorm.io/gorm"
)

// TestCaseResultRepository implements the TestCaseResultRepository interface using GORM.
type TestCaseResultRepository struct {
	db *gorm.DB
}

// NewTestCaseResultRepository creates a new GORM-based test case result repository.
func NewTestCaseResultRepository(db *gorm.DB) *TestCaseResultRepository {
	return &TestCaseResultRepository{db: db}
}

// Create inserts a new test case result.
func (r *TestCaseResultRepository) Create(result *domain.TestCaseResult) error {
	return r.db.Create(result).Error
}

// CreateBatch inserts multiple test case results.
func (r *TestCaseResultRepository) CreateBatch(results []*domain.TestCaseResult) error {
	return r.db.Create(&results).Error
}
