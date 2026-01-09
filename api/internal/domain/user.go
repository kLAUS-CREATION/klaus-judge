package domain

import "time"

type User struct {
	ID            uint      `gorm:"primaryKey"`
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
