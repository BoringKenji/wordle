package game

import (
    "backend/internal/wordlist"
)

type GameState struct {
    ID             string             `json:"id"`
    MaxAttempts    int                `json:"maxAttempts"`
    Guesses        []string           `json:"guesses"`
    GameOver       bool               `json:"gameOver"`
    Message        string             `json:"message"`
    WordList       *wordlist.WordList `json:"-"`
    Candidates     []string           `json:"-"`
    HostCheating   bool               `json:"hostCheating"`
    TargetWord     string             `json:"-"`
}

type GuessResult struct {
    Guesses        []string `json:"guesses"`
    GameOver       bool     `json:"gameOver"`
    Message        string   `json:"message"`
    LetterStatuses []string `json:"letterStatuses"`
}