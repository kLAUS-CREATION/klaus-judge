package repository

import (
	"github.com/google/uuid"
	"github.com/klaus-creations/klaus-judge/api/internal/domain"
)

// UserRepository defines the interface for user data operations.
type UserRepository interface {
	Create(user *domain.User) error
	FindByEmail(email string) (*domain.User, error)
	FindByUsername(username string) (*domain.User, error)
	FindByID(id uuid.UUID) (*domain.User, error)
	Update(user *domain.User) error
}
