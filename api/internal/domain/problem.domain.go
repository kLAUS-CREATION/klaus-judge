package domain

import "time"

type Problem struct {
	ID          uint      `gorm:"primaryKey"`
	Title       string    `gorm:"not null;index"`
	Slug        string    `gorm:"uniqueIndex;not null"`
	Description string    `gorm:"type:text;not null"`
	Difficulty  string    `gorm:"default:'easy'"`
	TimeLimit   int       `gorm:"not null"`
	MemoryLimit int       `gorm:"not null"`

	// Statistics
	AcceptedCount   int `gorm:"default:0"`
	SubmissionCount int `gorm:"default:0"`

	// Metadata
	Tags      string    `gorm:"type:text"`
	CreatedBy uint      `gorm:"not null"`
	CreatedAt time.Time `gorm:"autoCreateTime"`
	UpdatedAt time.Time `gorm:"autoUpdateTime"`

	// Relationships
	TestCases   []TestCase   `gorm:"foreignKey:ProblemID"`
	Submissions []Submission `gorm:"foreignKey:ProblemID"`
}
