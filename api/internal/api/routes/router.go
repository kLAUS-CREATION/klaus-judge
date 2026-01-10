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
	problemRepo := gormRepo.NewProblemRepository(db)
	testCaseRepo := gormRepo.NewTestCaseRepository(db)
	submissionRepo := gormRepo.NewSubmissionRepository(db)
	testCaseResultRepo := gormRepo.NewTestCaseResultRepository(db)

	// Services
	authService := services.NewAuthService(userRepo)
	problemService := services.NewProblemService(problemRepo, testCaseRepo)
	submissionService := services.NewSubmissionService(submissionRepo, testCaseResultRepo, problemRepo, userRepo)

	// Handlers
	authHandler := handlers.NewAuthHandler(authService)
	problemHandler := handlers.NewProblemHandler(problemService)
	submissionHandler := handlers.NewSubmissionHandler(submissionService)

	// ************ ROUTES ****************************
	// PUBLIC ROUTES
	public := r.Group("/api/v1")
	public.GET("/health", handlers.HealthCheck)

	// AUTH ROUTES
	RegisterAuthRoutes(public, authHandler)

	// PROBLEM ROUTES
	RegisterProblemRoutes(public, problemHandler)

	// PROTECTED ROUTES
	protected := r.Group("/api/v1")
	protected.Use(middlewares.AuthMiddleware())

	// USER ROUTES
	RegisterUserRoutes(protected, authHandler)

	// SUBMISSION ROUTES
	RegisterSubmissionRoutes(protected, submissionHandler)
}
