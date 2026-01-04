package domain

import "time"

type User struct {
	ID           uint
	FullName     string
	Email        string
	Username     string
	PasswordHash string
	CreatedAt    time.Time
}
