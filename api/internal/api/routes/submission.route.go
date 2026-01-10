package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/klaus-creations/klaus-judge/api/internal/api/handlers"
	"github.com/klaus-creations/klaus-judge/api/internal/api/middlewares"
)

func RegisterSubmissionRoutes(rg *gin.RouterGroup, h *handlers.SubmissionHandler) {
	submissions := rg.Group("/submissions")
	{
		// Protected routes (auth required)
		submissions.Use(middlewares.AuthMiddleware())
		submissions.POST("", h.SubmitSolution)
		submissions.GET("", h.ListMySubmissions)
		submissions.GET("/:id", h.GetSubmission)

		// Admin-only routes
		admin := submissions.Group("")
		admin.Use(middlewares.AdminMiddleware())
		admin.GET("/all", h.ListAllSubmissions)
	}
}
