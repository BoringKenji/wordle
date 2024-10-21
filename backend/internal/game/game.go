package game

import (
	"errors"
	"strings"

	"backend/internal/utils"
	"backend/internal/wordlist"
)

type Manager struct {
	wordList   *wordlist.WordList
	gameStates map[string]*GameState
}

func NewManager(wl *wordlist.WordList) *Manager {
	return &Manager{
		wordList:   wl,
		gameStates: make(map[string]*GameState),
	}
}

func (m *Manager) NewGame() *GameState {
    gameID := utils.GenerateGameID()
    gameWordList := wordlist.New(m.wordList.GetWords()) // Create a new word list for this game
    targetWord := gameWordList.GetRandomWord()
    gameState := &GameState{
        ID:          gameID,
        TargetWord:  targetWord,
        MaxAttempts: 6,
        Guesses:     []string{},
        GameOver:    false,
        Message:     "",
        WordList:    gameWordList,
    }
    m.gameStates[gameID] = gameState
    return gameState
}

func (m *Manager) GetWordList(gameID string) ([]string, error) {
    gameState, exists := m.gameStates[gameID]
    if !exists {
        return nil, errors.New("Game not found")
    }
    return gameState.WordList.GetWords(), nil
}

func (m *Manager) MakeGuess(gameID, guess string) (*GuessResult, error) {
    gameState, exists := m.gameStates[gameID]
    if !exists {
        return nil, errors.New("Game not found")
    }

	if gameState.GameOver {
		return nil, errors.New("Game is already over")
	}

	guess = strings.ToUpper(guess)

	if len(guess) != 5 {
		return nil, errors.New("Please enter a 5-letter word")
	}

    if !gameState.WordList.Contains(guess) {
        return nil, errors.New("Word not in the allowed list")
    }

	gameState.Guesses = append(gameState.Guesses, guess)

	letterStatuses := calculateLetterStatuses(gameState.TargetWord, guess)

	if guess == gameState.TargetWord {
		gameState.GameOver = true
		gameState.Message = "Congratulations! You guessed the word!"
	} else if len(gameState.Guesses) >= gameState.MaxAttempts {
		gameState.GameOver = true
		gameState.Message = "Game over! The word was " + gameState.TargetWord
	}

	return &GuessResult{
		Guesses:        gameState.Guesses,
		GameOver:       gameState.GameOver,
		Message:        gameState.Message,
		LetterStatuses: letterStatuses,
	}, nil
}

func (m *Manager) UpdateSettings(gameID string, maxAttempts int, wordList []string) error {
    gameState, exists := m.gameStates[gameID]
    if !exists {
        return errors.New("game not found")
    }

    if maxAttempts > 0 {
        gameState.MaxAttempts = maxAttempts
    }

    if len(wordList) > 0 {
        gameState.WordList.UpdateWordList(wordList)
        gameState.TargetWord = gameState.WordList.GetRandomWord()
    }

    // Reset the game
    gameState.Guesses = []string{}
    gameState.GameOver = false
    gameState.Message = ""

    return nil
}

func calculateLetterStatuses(targetWord, guess string) []string {
	letterStatuses := make([]string, 5)
	targetWordCopy := []rune(targetWord)
	
	// First pass: mark correct letters
	for i := 0; i < 5; i++ {
		if guess[i] == targetWord[i] {
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

	return letterStatuses
}