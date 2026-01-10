package config

import (
	"github.com/klaus-creations/klaus-judge/api/internal/domain"
	"gorm.io/gorm"
)

func Migrate(db *gorm.DB) error {
    return db.AutoMigrate(
		&domain.User{},
		&domain.Problem{},
		&domain.TestCase{},
		&domain.Submission{},
		&domain.TestCaseResult{},
		&domain.Contest{},
	)
}
