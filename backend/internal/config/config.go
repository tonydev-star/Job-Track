package config

import (
	"fmt"
	"os"
	"strconv"
)

type Config struct {
	Port                      string
	Environment               string
	FrontendURL               string
	FirebaseProjectID         string
	GoogleApplicationCredentials string
}

func Load() Config {
	port := getEnv("PORT", "8080")
	return Config{
		Port:                        port,
		Environment:                 getEnv("ENVIRONMENT", "development"),
		FrontendURL:                 getEnv("FRONTEND_URL", "http://localhost:5173"),
		FirebaseProjectID:           getEnv("FIREBASE_PROJECT_ID", ""),
		GoogleApplicationCredentials: getEnv("GOOGLE_APPLICATION_CREDENTIALS", ""),
	}
}

func (c Config) Addr() string {
	return fmt.Sprintf(":%s", c.Port)
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok && value != "" {
		return value
	}
	return fallback
}

func getEnvBool(key string, fallback bool) bool {
	value, ok := os.LookupEnv(key)
	if !ok {
		return fallback
	}
	parsed, err := strconv.ParseBool(value)
	if err != nil {
		return fallback
	}
	return parsed
}
