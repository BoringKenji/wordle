package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"backend/internal/game"
)

type SettingsHandler struct {
	gameManager *game.Manager
}

func NewSettingsHandler(gm *game.Manager) *SettingsHandler {
	return &SettingsHandler{gameManager: gm}
}

func (h *SettingsHandler) UpdateSettings(c *gin.Context) {
	var request struct {
		GameID       string   `json:"gameId"`
		MaxAttempts  int      `json:"maxAttempts"`
		WordList     []string `json:"wordList"`
		HostCheating bool     `json:"hostCheating"`
	}

	if err := c.BindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	err := h.gameManager.UpdateSettings(request.GameID, request.MaxAttempts, request.WordList, request.HostCheating)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Settings updated successfully"})
}

func (h *SettingsHandler) GetWordList(c *gin.Context) {
    gameID := c.Query("gameId")
    if gameID == "" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Game ID is required"})
        return
    }

    wordList, err := h.gameManager.GetWordList(gameID)
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"wordList": wordList})
}