package config

import (
	"errors"
	"github.com/joho/godotenv"
)

func LoadEnviromentVariables() error {
	err := godotenv.Load()

	if err != nil {
		return errors.New("failed to load env")
	}

	return nil
}


