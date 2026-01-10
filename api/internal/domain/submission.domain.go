package domain

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Submission struct {
	ID        uuid.UUID `gorm:"primaryKey;type:uuid"`
	UserID    uuid.UUID `gorm:"not null;index;type:uuid"`
	ProblemID uuid.UUID `gorm:"not null;index;type:uuid"`
	Code      string    `gorm:"type:text;not null"`
	Language  string    `gorm:"not null"` // cpp, python, java, rust, go

	// Execution results
	Verdict       string  `gorm:"default:'QUEUED'"` // QUEUED, JUDGING, AC, WA, TLE, MLE, RE, CE
	ExecutionTime int     `gorm:"default:0"`        // in milliseconds
	MemoryUsed    int     `gorm:"default:0"`        // in KB
	Score         float64 `gorm:"default:0"`        // for partial scoring

	// Error details (if any)
	CompileError string `gorm:"type:text"`
	RuntimeError string `gorm:"type:text"`
	TestsPassed  int    `gorm:"default:0"`
	TestsFailed  int    `gorm:"default:0"`

	// Metadata
	IPAddress   string    `gorm:"size:45"` // IPv6 compatible
	SubmittedAt time.Time `gorm:"autoCreateTime;index"`
	JudgedAt    *time.Time

	// Relationships
	User        User             `gorm:"foreignKey:UserID"`
	Problem     Problem          `gorm:"foreignKey:ProblemID"`
	TestResults []TestCaseResult `gorm:"foreignKey:SubmissionID"`
}

func (s *Submission) BeforeCreate(tx *gorm.DB) (err error) {
	if s.ID == uuid.Nil {
		s.ID, err = uuid.NewV7()
	}
	return
}
