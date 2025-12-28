package main

import (
	"fmt"
	"github.com/klaus-creations/klaus-judge/api/internal/routes"
)

func main() {
	r := routes.SetupRouter()

	fmt.Println("Server starting on port 8080...")
	if err := r.Run(":8080"); err != nil {
		panic(err)
	}
}
