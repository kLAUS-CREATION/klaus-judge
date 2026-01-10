package domain

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type TestCaseResult struct {
	ID           uuid.UUID `gorm:"primaryKey;type:uuid"`
	SubmissionID uuid.UUID `gorm:"not null;index;type:uuid"`
	TestCaseID   uuid.UUID `gorm:"not null;type:uuid"`

	Verdict       string `gorm:"not null"`  // AC, WA, TLE, MLE, RE
	ExecutionTime int    `gorm:"default:0"` // in milliseconds
	MemoryUsed    int    `gorm:"default:0"` // in KB
	Output        string `gorm:"type:text"` // actual output (truncated if too large)
	ErrorMessage  string `gorm:"type:text"` // stderr or error details

	CreatedAt time.Time `gorm:"autoCreateTime"`

	// Relationships
	Submission Submission `gorm:"foreignKey:SubmissionID"`
	TestCase   TestCase   `gorm:"foreignKey:TestCaseID"`
}

func (tcr *TestCaseResult) BeforeCreate(tx *gorm.DB) (err error) {
	if tcr.ID == uuid.Nil {
		tcr.ID, err = uuid.NewV7()
	}
	return
}
