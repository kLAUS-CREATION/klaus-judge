package gorm

import (
	"github.com/google/uuid"
	"github.com/klaus-creations/klaus-judge/api/internal/domain"
	"gorm.io/gorm"
)

// UserRepository implements the UserRepository interface using GORM.
type UserRepository struct {
	db *gorm.DB
}

// NewUserRepository creates a new GORM-based user repository.
func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{db: db}
}

// Create inserts a new user into the database.
func (r *UserRepository) Create(user *domain.User) error {
	return r.db.Create(user).Error
}

// FindByEmail retrieves a user by email.
func (r *UserRepository) FindByEmail(email string) (*domain.User, error) {
	var user domain.User
	err := r.db.Where("email = ?", email).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

// FindByUsername retrieves a user by username.
func (r *UserRepository) FindByUsername(username string) (*domain.User, error) {
	var user domain.User
	err := r.db.Where("username = ?", username).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

// FindByID retrieves a user by ID.
func (r *UserRepository) FindByID(id uuid.UUID) (*domain.User, error) {
	var user domain.User
	err := r.db.First(&user, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

// Update updates an existing user in the database.
func (r *UserRepository) Update(user *domain.User) error {
	return r.db.Save(user).Error
}
