package main

import (
	"github.com/klaus-creations/klaus-judge/api/internal/config"
	"github.com/klaus-creations/klaus-judge/api/internal/routes"
)


func init () {
	config.Connectdatabase()
}

func main() {
	r := routes.SetupRouter()
	r.Run(":8080")
}
