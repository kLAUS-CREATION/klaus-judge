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


func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")

		allowedOrigins := map[string]bool{
			"http://localhost:3000": true,
			"http://localhost:3001": true,
			"http://localhost:8080": true,
		}

		if allowedOrigins[origin] {
			c.Header("Access-Control-Allow-Origin", origin)
			c.Header("Access-Control-Allow-Credentials", "true")
		}

		c.Header("Access-Control-Allow-Headers",
			"Content-Type, Authorization, X-Requested-With, Accept, Origin")
		c.Header("Access-Control-Allow-Methods",
			"GET, POST, PUT, PATCH, DELETE, OPTIONS")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

// SetupRouter initializes all routes and dependencies
func SetupRouter(r *gin.Engine, db *gorm.DB) {
	// ********* CORS MIDDLEWARE **************
	r.Use(CORSMiddleware())
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

	//  Rate Limiting
	redisClient := config.GetRedisClient()

	// 1. Global Limiter (IP Based): 1000 req / hour
	// Helps prevent general abuse / scraping
	r.Use(middlewares.NewRateLimiterMiddleware(redisClient, middlewares.Rate(1000, time.Hour), "limiter:global"))

	// ROUTES

	// public routes
	public := r.Group("/api/v1")
	public.GET("/health", handlers.HealthCheck)

	// auth routes
	authGroup := public.Group("")
	// 5 req / minute to prevent brute force
	authGroup.Use(middlewares.NewRateLimiterMiddleware(redisClient, middlewares.Rate(5, time.Minute), "limiter:auth"))
	RegisterAuthRoutes(authGroup, authHandler)

	// problem routes
	RegisterProblemRoutes(public, problemHandler)

	// protected routes
	protected := r.Group("/api/v1")
	protected.Use(middlewares.AuthMiddleware())

	// user routes
	RegisterUserRoutes(protected, authHandler)

	// submission routes (Very Strict)
	// 1 req / 10 seconds to prevent judge overload
	submissionGroup := protected.Group("/submissions")
	submissionGroup.Use(middlewares.NewUserRateLimiterMiddleware(redisClient, middlewares.Rate(1, 10*time.Second), "limiter:submission"))

	// We manually register submission routes here to apply the specific middleware group
	submissionGroup.POST("", submissionHandler.SubmitSolution)
	submissionGroup.GET("", submissionHandler.ListMySubmissions) // User's own submissions
	submissionGroup.GET("/:id", submissionHandler.GetSubmission)
}
