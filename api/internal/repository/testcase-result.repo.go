package repository

import "github.com/klaus-creations/klaus-judge/api/internal/domain"

// TestCaseResultRepository defines the interface for test case result operations.
type TestCaseResultRepository interface {
	Create(result *domain.TestCaseResult) error
	CreateBatch(results []*domain.TestCaseResult) error
}
