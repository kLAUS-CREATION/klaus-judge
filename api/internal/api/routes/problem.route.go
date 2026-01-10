package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/klaus-creations/klaus-judge/api/internal/api/handlers"
	"github.com/klaus-creations/klaus-judge/api/internal/api/middlewares"
)

func RegisterProblemRoutes(rg *gin.RouterGroup, h *handlers.ProblemHandler) {
	problems := rg.Group("/problems")
	{
		// Public routes for problems
		problems.GET("", h.ListProblems)
		problems.GET("/:slug", h.GetProblem)

		// Protected routes (auth required)
		problems.Use(middlewares.AuthMiddleware())

		// Admin-only routes
		admin := problems.Group("")
		admin.Use(middlewares.AdminMiddleware())
		admin.POST("", h.CreateProblem)        // Create new problem
		admin.PUT("/:slug", h.UpdateProblem)   // Update problem
		admin.DELETE("/:slug", h.DeleteProblem)// Delete problem

		// Test case management (admin only)
		testcases := problems.Group("/:slug/testcases")
		testcases.Use(middlewares.AdminMiddleware())
		testcases.POST("", h.AddTestCase)      // Add test case
		testcases.PUT("/:id", h.UpdateTestCase)// Update test case
		testcases.DELETE("/:id", h.DeleteTestCase) // Delete test case
	}
}
