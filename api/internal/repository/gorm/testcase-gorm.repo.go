package gorm

import (
	"github.com/klaus-creations/klaus-judge/api/internal/domain"
	"gorm.io/gorm"
)

// TestCaseRepository implements the TestCaseRepository interface using GORM.
type TestCaseRepository struct {
	db *gorm.DB
}

// NewTestCaseRepository creates a new GORM-based test case repository.
func NewTestCaseRepository(db *gorm.DB) *TestCaseRepository {
	return &TestCaseRepository{db: db}
}

// Create inserts a new test case.
func (r *TestCaseRepository) Create(testCase *domain.TestCase) error {
	return r.db.Create(testCase).Error
}

// FindByID retrieves a test case by ID.
func (r *TestCaseRepository) FindByID(id uint) (*domain.TestCase, error) {
	var testCase domain.TestCase
	err := r.db.First(&testCase, id).Error
	if err != nil {
		return nil, err
	}
	return &testCase, nil
}

// FindByProblemID retrieves all test cases for a problem.
func (r *TestCaseRepository) FindByProblemID(problemID uint) ([]*domain.TestCase, error) {
	var testCases []*domain.TestCase
	err := r.db.Where("problem_id = ?", problemID).Order("order_index ASC").Find(&testCases).Error
	if err != nil {
		return nil, err
	}
	return testCases, nil
}

// Update updates a test case.
func (r *TestCaseRepository) Update(testCase *domain.TestCase) error {
	return r.db.Save(testCase).Error
}

// Delete removes a test case by ID.
func (r *TestCaseRepository) Delete(id uint) error {
	return r.db.Delete(&domain.TestCase{}, id).Error
}
