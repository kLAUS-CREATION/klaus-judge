package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/klaus-creations/klaus-judge/api/internal/api/handlers"
)

func RegisterAuthRoutes(rg *gin.RouterGroup, h *handlers.AuthHandler) {
	auth := rg.Group("/auth")
	{
		auth.POST("/register", h.Register)
		auth.POST("/login", h.Login)
		auth.POST("/refresh", h.RefreshToken)
		auth.POST("/logout", h.Logout)
	}
}
