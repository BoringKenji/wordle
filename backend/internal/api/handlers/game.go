package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"backend/internal/game"
)

type GameHandler struct {
	gameManager *game.Manager
}

func NewGameHandler(gm *game.Manager) *GameHandler {
	return &GameHandler{gameManager: gm}
}

func (h *GameHandler) NewGame(c *gin.Context) {
	gameState := h.gameManager.NewGame()

	c.JSON(http.StatusOK, gin.H{
		"gameId":      gameState.ID,
		"maxAttempts": gameState.MaxAttempts,
	})
}

func (h *GameHandler) MakeGuess(c *gin.Context) {
	var request struct {
		GameID string `json:"gameId"`
		Guess  string `json:"guess"`
	}

	if err := c.BindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	result, err := h.gameManager.MakeGuess(request.GameID, request.Guess)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, result)
}