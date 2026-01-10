package routes

import (
	"time"

	"github.com/gin-gonic/gin"
	"github.com/klaus-creations/klaus-judge/api/internal/api/handlers"
	"github.com/klaus-creations/klaus-judge/api/internal/api/middlewares"
	"github.com/klaus-creations/klaus-judge/api/internal/config"
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

	// ********* RATE LIMITING **************
	redisClient := config.GetRedisClient()

	// 1. Global Limiter (IP Based): 1000 req / hour
	// Helps prevent general abuse / scraping
	r.Use(middlewares.NewRateLimiterMiddleware(redisClient, middlewares.Rate(1000, time.Hour), "limiter:global"))

	// ************ ROUTES ****************************
	// PUBLIC ROUTES
	public := r.Group("/api/v1")
	public.GET("/health", handlers.HealthCheck)

	// AUTH ROUTES (Stricter Limits)
	// 5 req / minute to prevent brute force
	authGroup := public.Group("/auth")
	authGroup.Use(middlewares.NewRateLimiterMiddleware(redisClient, middlewares.Rate(5, time.Minute), "limiter:auth"))
	RegisterAuthRoutes(authGroup, authHandler)

	// PROBLEM ROUTES
	RegisterProblemRoutes(public, problemHandler)

	// PROTECTED ROUTES
	protected := r.Group("/api/v1")
	protected.Use(middlewares.AuthMiddleware())

	// USER ROUTES
	RegisterUserRoutes(protected, authHandler)

	// SUBMISSION ROUTES (Very Strict)
	// 1 req / 10 seconds to prevent judge overload
	submissionGroup := protected.Group("/submissions")
	submissionGroup.Use(middlewares.NewUserRateLimiterMiddleware(redisClient, middlewares.Rate(1, 10*time.Second), "limiter:submission"))

	// We manually register submission routes here to apply the specific middleware group
	submissionGroup.POST("", submissionHandler.SubmitSolution)
	submissionGroup.GET("", submissionHandler.ListMySubmissions) // User's own submissions
	submissionGroup.GET("/:id", submissionHandler.GetSubmission)

	// Note: Admin list submissions route might need to be exempt or higher limit,
	// but for now it shares the group. We can refactor if needed.
}
