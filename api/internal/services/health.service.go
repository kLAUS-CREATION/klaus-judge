package services

import (
	"github.com/klaus-creations/klaus-judge/api/internal/models"
	"github.com/klaus-creations/klaus-judge/api/internal/repository"
)

type HealthService struct {
	repo *repository.HealthRepository
}

func NewHealthService(repo *repository.HealthRepository) *HealthService {
	return &HealthService{repo: repo}
}

func (s *HealthService) GetSystemStatus() models.HealthResponse {
	dbStatus := s.repo.MockDatabaseCheck()

	return models.HealthResponse{
		Status:  "OK",
		Message: "Klaus Judge API is running",
		Uptime:  dbStatus,
	}
}
