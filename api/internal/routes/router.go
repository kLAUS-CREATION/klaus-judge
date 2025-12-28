package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/klaus-creations/klaus-judge/api/internal/handlers"
	"github.com/klaus-creations/klaus-judge/api/internal/repository"
	"github.com/klaus-creations/klaus-judge/api/internal/services"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()
	healthRepo := repository.NewHealthRepository()
	healthService := services.NewHealthService(healthRepo)
	healthHandler := handlers.NewHealthHandler(healthService)

	// API Routes
	api := r.Group("/api/v1")
	{
		api.GET("/health", healthHandler.Ping)
	}

	return r
}
