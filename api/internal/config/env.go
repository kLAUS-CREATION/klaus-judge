package config

import (
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

func LoadEnviromentVariables() error {
	err := godotenv.Load()

	if err != nil {
		return nil
	}

	return nil
}

func GetEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}

func GetEnvInt(key string, defaultValue int) int {
	if value, ok := os.LookupEnv(key); ok {
		if intValue, err := strconv.Atoi(value); err == nil {
			return intValue
		}

	}
	return defaultValue
}
