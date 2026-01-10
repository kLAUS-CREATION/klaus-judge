package domain

import "time"

type TestCase struct {
	ID             uint   `gorm:"primaryKey"`
	ProblemID      uint   `gorm:"not null;index"`
	Input          string `gorm:"type:text;not null"`
	ExpectedOutput string `gorm:"type:text;not null"`
	IsSample       bool   `gorm:"default:false"`
	IsHidden       bool   `gorm:"default:true"`
	Points         int    `gorm:"default:10"`
	OrderIndex     int    `gorm:"not null"`

	CreatedAt time.Time `gorm:"autoCreateTime"`
	UpdatedAt time.Time `gorm:"autoUpdateTime"`

	// Relationships
	Problem Problem `gorm:"foreignKey:ProblemID"`
}
