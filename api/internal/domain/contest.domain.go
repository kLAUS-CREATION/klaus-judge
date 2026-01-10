package domain

import "time"

type Contest struct {
	ID          uint      `gorm:"primaryKey"`
	Title       string    `gorm:"not null"`
	Description string    `gorm:"type:text"`
	StartTime   time.Time `gorm:"not null"`
	EndTime     time.Time `gorm:"not null"`
	IsPublic    bool      `gorm:"default:true"`
	CreatedBy   uint      `gorm:"not null"`

	CreatedAt time.Time `gorm:"autoCreateTime"`
	UpdatedAt time.Time `gorm:"autoUpdateTime"`
}
