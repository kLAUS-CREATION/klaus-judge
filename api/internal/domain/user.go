package domain

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	ID            uuid.UUID `gorm:"primaryKey;type:uuid"`
	FullName      string    `gorm:"not null"`
	Email         string    `gorm:"uniqueIndex;not null"`
	Username      string    `gorm:"uniqueIndex;not null"`
	PasswordHash  string    `gorm:"not null"`
	Role          string    `gorm:"default:'user'"`
	Verified      bool      `gorm:"default:false"`
	LastLogin     time.Time
	SolvedProblems int       `gorm:"default:0"`
	Rating        int       `gorm:"default:1000"`
	CreatedAt     time.Time `gorm:"autoCreateTime"`
	UpdatedAt     time.Time `gorm:"autoUpdateTime"`
}

func (u *User) BeforeCreate(tx *gorm.DB) (err error) {
	if u.ID == uuid.Nil {
		u.ID, err = uuid.NewV7()
	}
	return
}
