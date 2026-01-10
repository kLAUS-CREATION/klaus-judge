package domain

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Problem struct {
	ID          uuid.UUID `gorm:"primaryKey;type:uuid"`
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
	CreatedBy uuid.UUID `gorm:"not null;type:uuid"`
	CreatedAt time.Time `gorm:"autoCreateTime"`
	UpdatedAt time.Time `gorm:"autoUpdateTime"`

	// Relationships
	TestCases   []TestCase   `gorm:"foreignKey:ProblemID"`
	Submissions []Submission `gorm:"foreignKey:ProblemID"`
}

func (p *Problem) BeforeCreate(tx *gorm.DB) (err error) {
	if p.ID == uuid.Nil {
		p.ID, err = uuid.NewV7()
	}
	return
}
