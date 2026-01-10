package repository

import "github.com/klaus-creations/klaus-judge/api/internal/domain"

// TestCaseRepository defines the interface for test case operations.
type TestCaseRepository interface {
	Create(testCase *domain.TestCase) error
	FindByID(id uint) (*domain.TestCase, error)
	FindByProblemID(problemID uint) ([]*domain.TestCase, error)
	Update(testCase *domain.TestCase) error
	Delete(id uint) error
}
