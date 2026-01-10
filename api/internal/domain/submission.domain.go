package domain

import "time"

type Submission struct {
	ID        uint   `gorm:"primaryKey"`
	UserID    uint   `gorm:"not null;index"`
	ProblemID uint   `gorm:"not null;index"`
	Code      string `gorm:"type:text;not null"`
	Language  string `gorm:"not null"` // cpp, python, java, rust, go

	// Execution results
	Verdict       string  `gorm:"default:'QUEUED'"` // QUEUED, JUDGING, AC, WA, TLE, MLE, RE, CE
	ExecutionTime int     `gorm:"default:0"`        // in milliseconds
	MemoryUsed    int     `gorm:"default:0"`        // in KB
	Score         float64 `gorm:"default:0"`        // for partial scoring

	// Error details (if any)
	CompileError  string `gorm:"type:text"`
	RuntimeError  string `gorm:"type:text"`
	TestsPassed   int    `gorm:"default:0"`
	TestsFailed   int    `gorm:"default:0"`

	// Metadata
	IPAddress  string    `gorm:"size:45"` // IPv6 compatible
	SubmittedAt time.Time `gorm:"autoCreateTime;index"`
	JudgedAt    *time.Time

	// Relationships
	User         User               `gorm:"foreignKey:UserID"`
	Problem      Problem            `gorm:"foreignKey:ProblemID"`
	TestResults  []TestCaseResult   `gorm:"foreignKey:SubmissionID"`
}
