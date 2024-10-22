package wordlist

type WordList struct {
    words map[string]bool
}

func New(initialWords []string) *WordList {
    wl := &WordList{
        words: make(map[string]bool),
    }
    for _, word := range initialWords {
        wl.words[word] = true
    }
    return wl
}

func (wl *WordList) GetWords() []string {
    words := make([]string, 0, len(wl.words))
    for word := range wl.words {
        words = append(words, word)
    }
    return words
}

func (wl *WordList) Contains(word string) bool {
    return wl.words[word]
}

func (wl *WordList) UpdateWordList(newWords []string) {
    wl.words = make(map[string]bool)
    for _, word := range newWords {
        wl.words[word] = true
    }
}