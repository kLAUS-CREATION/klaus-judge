package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/klaus-creations/klaus-judge/api/internal/handlers"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()
	// Health check
	r.GET("/health", handlers.HealthCheck)
	return r
}
