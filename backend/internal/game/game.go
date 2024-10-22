package game

import (
    "errors"
    "strings"
    "math/rand"

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
    gameWordList := wordlist.New(m.wordList.GetWords())
    words := gameWordList.GetWords()
    targetWord := words[rand.Intn(len(words))]
    gameState := &GameState{
        ID:           gameID,
        MaxAttempts:  6,
        Guesses:      []string{},
        GameOver:     false,
        Message:      "",
        WordList:     gameWordList,
        Candidates:   words,
        HostCheating: true,
        TargetWord:   targetWord,
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

    var bestPattern []string
    var newCandidates []string

    if gameState.HostCheating {
        // Find the best response pattern (Absurdle mode)
        bestPattern, newCandidates = findBestResponsePattern(gameState.Candidates, guess)
        gameState.Candidates = newCandidates
    } else {
        // Normal Wordle mode
        bestPattern = calculatePattern(gameState.TargetWord, guess)
    }

    if (gameState.HostCheating && len(gameState.Candidates) == 1 && guess == gameState.Candidates[0]) ||
       (!gameState.HostCheating && guess == gameState.TargetWord) {
        gameState.GameOver = true
        gameState.Message = "Congratulations! You guessed the word!"
    } else if len(gameState.Guesses) >= gameState.MaxAttempts {
        gameState.GameOver = true
        if gameState.HostCheating {
            gameState.Message = "Game over! The word was: " + gameState.Candidates[0]
        } else {
            gameState.Message = "Game over! The word was: " + gameState.TargetWord
        }
    }

    return &GuessResult{
        Guesses:        gameState.Guesses,
        GameOver:       gameState.GameOver,
        Message:        gameState.Message,
        LetterStatuses: bestPattern,
    }, nil
}


func (m *Manager) UpdateSettings(gameID string, maxAttempts int, wordList []string, hostCheating bool) error {
    gameState, exists := m.gameStates[gameID]
    if !exists {
        return errors.New("game not found")
    }

    if maxAttempts > 0 {
        gameState.MaxAttempts = maxAttempts
    }

    if len(wordList) > 0 {
        gameState.WordList.UpdateWordList(wordList)
        gameState.Candidates = wordList
    }

    gameState.HostCheating = hostCheating

    // Reset the game
    gameState.Guesses = []string{}
    gameState.GameOver = false
    gameState.Message = ""

    if !hostCheating {
        gameState.TargetWord = gameState.Candidates[rand.Intn(len(gameState.Candidates))]
    }

    return nil
}

func findBestResponsePattern(candidates []string, guess string) ([]string, []string) {
    patterns := make(map[string][]string)
    
    for _, candidate := range candidates {
        pattern := calculatePattern(candidate, guess)
        patternKey := strings.Join(pattern, ",")
        patterns[patternKey] = append(patterns[patternKey], candidate)
    }

    var bestPattern []string
    var bestCandidates []string
    bestScore := 100

    for pattern, candidateList := range patterns {
        score := calculatePatternScore(strings.Split(pattern, ","))
        if score < bestScore {
            bestScore = score
            bestPattern = strings.Split(pattern, ",")
            bestCandidates = candidateList
        }
    }

    return bestPattern, bestCandidates
}

func calculatePattern(target, guess string) []string {
    pattern := make([]string, 5)
    targetCopy := []rune(target)
    
    // First pass: mark correct letters
    for i := 0; i < 5; i++ {
        if guess[i] == target[i] {
            pattern[i] = "correct"
            targetCopy[i] = '_'
        }
    }

    // Second pass: mark present and absent letters
    for i := 0; i < 5; i++ {
        if pattern[i] == "" {
            if idx := strings.IndexRune(string(targetCopy), rune(guess[i])); idx != -1 {
                pattern[i] = "present"
                targetCopy[idx] = '_'
            } else {
                pattern[i] = "absent"
            }
        }
    }

    return pattern
}

func calculatePatternScore(pattern []string) int {
    score := 0
    for _, status := range pattern {
        if status == "correct" {
            score += 10
        } else if status == "present" {
            score += 1
        }
    }
    return score
}