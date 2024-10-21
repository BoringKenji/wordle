package main

import (
	"log"

	"backend/config"
	"backend/internal/api"
	"backend/internal/game"
	"backend/internal/wordlist"
)

func main() {
	cfg := config.Load()
	wordList := wordlist.New(cfg.DefaultWordList)
	gameManager := game.NewManager(wordList)
	
	router := api.SetupRouter(gameManager)
	
	log.Printf("Server starting on %s", cfg.ServerAddress)
	if err := router.Run(cfg.ServerAddress); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}