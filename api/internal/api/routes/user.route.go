package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/klaus-creations/klaus-judge/api/internal/api/handlers"
)

func RegisterUserRoutes(rg *gin.RouterGroup, h *handlers.AuthHandler) {
	users := rg.Group("/users")
	{
		users.GET("/me", h.GetProfile)
		users.PUT("/me", h.UpdateProfile)
		users.GET("/me/stats", h.GetStats)
	}
}
