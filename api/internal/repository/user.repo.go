package repository

import "github.com/klaus-creations/klaus-judge/api/internal/domain"

type UserRepository interface {
	Create(user *domain.User) error
	FindByEmail(email string) (*domain.User, error)
}
