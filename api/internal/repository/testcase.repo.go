package repository

import (
	"github.com/google/uuid"
	"github.com/klaus-creations/klaus-judge/api/internal/domain"
)

// TestCaseRepository defines the interface for test case operations.
type TestCaseRepository interface {
	Create(testCase *domain.TestCase) error
	FindByID(id uuid.UUID) (*domain.TestCase, error)
	FindByProblemID(problemID uuid.UUID) ([]*domain.TestCase, error)
	Update(testCase *domain.TestCase) error
	Delete(id uuid.UUID) error
}
