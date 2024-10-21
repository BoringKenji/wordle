package api

import (
	"github.com/gin-gonic/gin"
	"backend/internal/api/handlers"
	"backend/internal/game"
)

func SetupRouter(gameManager *game.Manager) *gin.Engine {
	r := gin.Default()

	// CORS middleware
	r.Use(CORSMiddleware())

	gameHandler := handlers.NewGameHandler(gameManager)
	settingsHandler := handlers.NewSettingsHandler(gameManager)

	r.POST("/new-game", gameHandler.NewGame)
	r.POST("/guess", gameHandler.MakeGuess)
	r.PUT("/settings", settingsHandler.UpdateSettings)
	r.GET("/word-list", settingsHandler.GetWordList)

	return r
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	}
}