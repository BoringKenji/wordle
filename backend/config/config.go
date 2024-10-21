package config

import (
	"os"
)

type Config struct {
	ServerAddress   string
	DefaultWordList []string
}

func Load() *Config {
	return &Config{
		ServerAddress: getEnv("SERVER_ADDRESS", ":8080"),
		DefaultWordList: []string{"REACT", "SWIFT", "SCALA", "UNITY"},
	}
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}