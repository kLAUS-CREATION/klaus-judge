package domain

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type TestCase struct {
	ID             uuid.UUID `gorm:"primaryKey;type:uuid"`
	ProblemID      uuid.UUID `gorm:"not null;index;type:uuid"`
	Input          string    `gorm:"type:text;not null"`
	ExpectedOutput string    `gorm:"type:text;not null"`
	IsSample       bool      `gorm:"default:false"`
	IsHidden       bool      `gorm:"default:true"`
	Points         int       `gorm:"default:10"`
	OrderIndex     int       `gorm:"not null"`

	CreatedAt time.Time `gorm:"autoCreateTime"`
	UpdatedAt time.Time `gorm:"autoUpdateTime"`

	// Relationships
	Problem Problem `gorm:"foreignKey:ProblemID"`
}

func (tc *TestCase) BeforeCreate(tx *gorm.DB) (err error) {
	if tc.ID == uuid.Nil {
		tc.ID, err = uuid.NewV7()
	}
	return
}
