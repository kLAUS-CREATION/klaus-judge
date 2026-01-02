package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/klaus-creations/klaus-judge/api/internal/api/handlers"
)

func RegisterAuthRoutes(
	router *gin.Engine,
	authHandler *handlers.AuthHandler,
) {
	auth := router.Group("/auth")
	{
		auth.POST("/signup", authHandler.SignUp)
	}
}
