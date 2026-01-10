package domain

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Contest struct {
	ID          uuid.UUID `gorm:"primaryKey;type:uuid"`
	Title       string    `gorm:"not null"`
	Description string    `gorm:"type:text"`
	StartTime   time.Time `gorm:"not null"`
	EndTime     time.Time `gorm:"not null"`
	IsPublic    bool      `gorm:"default:true"`
	CreatedBy   uuid.UUID `gorm:"not null;type:uuid"`

	CreatedAt time.Time `gorm:"autoCreateTime"`
	UpdatedAt time.Time `gorm:"autoUpdateTime"`
}

func (c *Contest) BeforeCreate(tx *gorm.DB) (err error) {
	if c.ID == uuid.Nil {
		c.ID, err = uuid.NewV7()
	}
	return
}
