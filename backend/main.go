package main

import (
	"math/rand"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

type GameState struct {
	TargetWord  string   `json:"-"`
	WordList    []string `json:"-"`
	MaxAttempts int      `json:"maxAttempts"`
	Guesses     []string `json:"guesses"`
	GameOver    bool     `json:"gameOver"`
	Message     string   `json:"message"`
}

var (
	defaultWordList = []string{"REACT", "SWIFT", "SCALA", "UNITY"}
	gameStates      = make(map[string]*GameState)
)

func main() {
	rand.Seed(time.Now().UnixNano())

	r := gin.Default()

	// Enable CORS
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	r.POST("/new-game", newGame)
	r.POST("/guess", makeGuess)
	r.PUT("/settings", updateSettings)

	r.Run(":8080")
}

func newGame(c *gin.Context) {
	gameID := generateGameID()
	targetWord := defaultWordList[rand.Intn(len(defaultWordList))]
	gameState := &GameState{
		TargetWord:  targetWord,
		WordList:    defaultWordList,
		MaxAttempts: 6,
		Guesses:     []string{},
		GameOver:    false,
		Message:     "",
	}
	gameStates[gameID] = gameState

	c.JSON(http.StatusOK, gin.H{
		"gameId":     gameID,
		"maxAttempts": gameState.MaxAttempts,
	})
}

func makeGuess(c *gin.Context) {
	var request struct {
		GameID string `json:"gameId"`
		Guess  string `json:"guess"`
	}

	if err := c.BindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	gameState, exists := gameStates[request.GameID]
	if !exists {
		c.JSON(http.StatusNotFound, gin.H{"error": "Game not found"})
		return
	}

	if gameState.GameOver {
		c.JSON(http.StatusOK, gin.H{"error": "Game is already over"})
		return
	}

	guess := strings.ToUpper(request.Guess)

	if len(guess) != 5 {
		c.JSON(http.StatusOK, gin.H{"error": "Please enter a 5-letter word"})
		return
	}

	if !contains(gameState.WordList, guess) {
		c.JSON(http.StatusOK, gin.H{"error": "Word not in the allowed list"})
		return
	}

	gameState.Guesses = append(gameState.Guesses, guess)

	// Calculate letter statuses
	letterStatuses := make([]string, 5)
	targetWordCopy := []rune(gameState.TargetWord)
	
	// First pass: mark correct letters
	for i := 0; i < 5; i++ {
		if guess[i] == gameState.TargetWord[i] {
			letterStatuses[i] = "correct"
			targetWordCopy[i] = '_' // Mark as used
		}
	}

	// Second pass: mark present and absent letters
	for i := 0; i < 5; i++ {
		if letterStatuses[i] == "" {
			if idx := strings.IndexRune(string(targetWordCopy), rune(guess[i])); idx != -1 {
				letterStatuses[i] = "present"
				targetWordCopy[idx] = '_' // Mark as used
			} else {
				letterStatuses[i] = "absent"
			}
		}
	}

	if guess == gameState.TargetWord {
		gameState.GameOver = true
		gameState.Message = "Congratulations! You guessed the word!"
	} else if len(gameState.Guesses) >= gameState.MaxAttempts {
		gameState.GameOver = true
		gameState.Message = "Game over! The word was " + gameState.TargetWord
	}

	response := struct {
		Guesses        []string   `json:"guesses"`
		GameOver       bool       `json:"gameOver"`
		Message        string     `json:"message"`
		LetterStatuses []string   `json:"letterStatuses"`
	}{
		Guesses:        gameState.Guesses,
		GameOver:       gameState.GameOver,
		Message:        gameState.Message,
		LetterStatuses: letterStatuses,
	}

	c.JSON(http.StatusOK, response)
}

func updateSettings(c *gin.Context) {
	var request struct {
		GameID      string   `json:"gameId"`
		MaxAttempts int      `json:"maxAttempts"`
		WordList    []string `json:"wordList"`
	}

	if err := c.BindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	gameState, exists := gameStates[request.GameID]
	if !exists {
		c.JSON(http.StatusNotFound, gin.H{"error": "Game not found"})
		return
	}

	if request.MaxAttempts > 0 {
		gameState.MaxAttempts = request.MaxAttempts
	}

	if len(request.WordList) > 0 {
		gameState.WordList = request.WordList
		gameState.TargetWord = request.WordList[rand.Intn(len(request.WordList))]
	}

	// Reset the game
	gameState.Guesses = []string{}
	gameState.GameOver = false
	gameState.Message = ""

	c.JSON(http.StatusOK, gin.H{"message": "Settings updated successfully"})
}

func generateGameID() string {
	return randomString(8)
}

func randomString(length int) string {
	const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	result := make([]byte, length)
	for i := range result {
		result[i] = charset[rand.Intn(len(charset))]
	}
	return string(result)
}

func contains(slice []string, item string) bool {
	for _, s := range slice {
		if s == item {
			return true
		}
	}
	return false
}