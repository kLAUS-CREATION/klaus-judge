package main

import (
	"fmt"
	"log"

	"github.com/gin-gonic/gin"
	"github.com/klaus-creations/klaus-judge/api/internal/api/routes"
	"github.com/klaus-creations/klaus-judge/api/internal/config"
)

func main() {
	// CONFIGURATIONS
	if err := config.LoadEnviromentVariables(); err != nil {
		log.Fatal("failed to load env:", err)
	}
	// Connect Postgres Database
	db, err := config.ConnectDatabase()
	if err != nil {
		log.Fatal("failed to connect database:", err)
	}

	// Connect Redis Database
	_, err = config.ConnectRedis();
	if (err != nil) {
		log.Fatal("failed to connect redis:", err)
	}

	fmt.Println("Database Connected Successfully")
	fmt.Println("Redis Connected Successfully")



	if err := config.Migrate(db); err != nil {
		log.Fatal("failed to migrate database:", err)
	}

	// SETUP THE GIN SERVER
	r := gin.Default()

	routes.SetupRouter(r, db)

	port := config.GetEnv("PORT", "8080")
	if err := r.Run(":" + port); err != nil {
		log.Fatal("failed to start server:", err)
	}
}
