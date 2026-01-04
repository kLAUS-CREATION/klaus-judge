
package main

import (
	"log"

	"github.com/gin-gonic/gin"

	"github.com/klaus-creations/klaus-judge/api/internal/config"
	"github.com/klaus-creations/klaus-judge/api/internal/api/handlers"
	"github.com/klaus-creations/klaus-judge/api/internal/api/routes"
	"github.com/klaus-creations/klaus-judge/api/internal/repository/gorm"
	"github.com/klaus-creations/klaus-judge/api/internal/services"
)

func main() {
	// LOAD ENVIROMENT VARIABLES
	if err := config.LoadEnviromentVariables(); err != nil {
		log.Fatal("failed to load env:", err)
	}

	// CONNECT TO DATABASE
	db, err := config.ConnectDatabase()
	if err != nil {
		log.Fatal("failed to connect database:", err)
	}


	// Migrate database
	if err := config.Migrate(db); err != nil {
		log.Fatal("failed to migrate database:", err)
	}

	// 3. Build dependencies (DI)
	userRepo := gorm.NewUserRepository(db)
	authService := service.NewAuthService(userRepo)
	authHandler := handlers.NewAuthHandler(authService)

	// 4. Setup Gin (like express())
	r := gin.Default()

	// 5. Register routes
	routes.RegisterAuthRoutes(r, authHandler)

	// 6. Start server (like app.listen)
	if err := r.Run(":8080"); err != nil {
		log.Fatal(err)
	}
}

