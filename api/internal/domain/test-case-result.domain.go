package domain

import "time"

type TestCaseResult struct {
	ID           uint   `gorm:"primaryKey"`
	SubmissionID uint   `gorm:"not null;index"`
	TestCaseID   uint   `gorm:"not null"`

	Verdict       string `gorm:"not null"` // AC, WA, TLE, MLE, RE
	ExecutionTime int    `gorm:"default:0"` // in milliseconds
	MemoryUsed    int    `gorm:"default:0"` // in KB
	Output        string `gorm:"type:text"` // actual output (truncated if too large)
	ErrorMessage  string `gorm:"type:text"` // stderr or error details

	CreatedAt time.Time `gorm:"autoCreateTime"`

	// Relationships
	Submission Submission `gorm:"foreignKey:SubmissionID"`
	TestCase   TestCase   `gorm:"foreignKey:TestCaseID"`
}
