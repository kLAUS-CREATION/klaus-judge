package service

import (
	"errors"

	"github.com/klaus-creations/klaus-judge/api/internal/domain"
	"github.com/klaus-creations/klaus-judge/api/internal/repository"
	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {
	users repository.UserRepository
}

func NewAuthService(users repository.UserRepository) *AuthService {
	return &AuthService{users: users}
}

func (s *AuthService) SignUp(
	fullName, email, username, password string,
) (*domain.User, error) {

	_, err := s.users.FindByEmail(email)
	if err == nil {
		return nil, errors.New("email already exists")
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(password), 10)
	if err != nil {
		return nil, err
	}

	user := &domain.User{
		FullName:     fullName,
		Email:        email,
		Username:     username,
		PasswordHash: string(hash),
	}

	if err := s.users.Create(user); err != nil {
		return nil, err
	}

	return user, nil
}
