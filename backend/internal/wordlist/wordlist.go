package wordlist

import (
	"math/rand"
)

type WordList struct {
	words []string
}

func New(initialWords []string) *WordList {
	return &WordList{words: initialWords}
}

func (wl *WordList) GetWords() []string {
    return wl.words
}

func (wl *WordList) GetRandomWord() string {
	return wl.words[rand.Intn(len(wl.words))]
}

func (wl *WordList) Contains(word string) bool {
	for _, w := range wl.words {
		if w == word {
			return true
		}
	}
	return false
}

func (wl *WordList) UpdateWordList(newWords []string) {
	wl.words = newWords
}