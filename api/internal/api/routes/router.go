package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/klaus-creations/klaus-judge/api/internal/api/handlers"
	"github.com/klaus-creations/klaus-judge/api/internal/api/middlewares"
	gormRepo "github.com/klaus-creations/klaus-judge/api/internal/repository/gorm"
	"github.com/klaus-creations/klaus-judge/api/internal/services"
	"gorm.io/gorm"
)

// SetupRouter initializes all routes and dependencies
func SetupRouter(r *gin.Engine, db *gorm.DB) {

	// ********* DEPENDENCY INJECTION **************
	// Repositories
	userRepo := gormRepo.NewUserRepository(db)

	// Services
	authService := services.NewAuthService(userRepo)

	// Handlers
	authHandler := handlers.NewAuthHandler(authService)

	// ************ ROUTES ****************************
	// PUBLIC ROUTES
	public := r.Group("/api/v1")
	public.GET("/health", handlers.HealthCheck)

	// AUTH ROUTES
	RegisterAuthRoutes(public, authHandler)

	// PROTECTED ROUTES
	protected := r.Group("/api/v1")
	protected.Use(middlewares.AuthMiddleware())

	// User routes
	RegisterUserRoutes(protected, authHandler)
}
