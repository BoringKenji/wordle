import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from '@emotion/styled';
import VirtualKeyboard from './VirtualKeyboard';

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 1rem;
`;

const Title = styled.h1`
  margin: 0;
`;

const SettingsButton = styled.button`
  background-color: #4CAF50;
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 4px;
`;

const Modal = styled.div`
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: #fefefe;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  max-width: 500px;
`;

const CloseButton = styled.span`
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 5px;
  margin-bottom: 1rem;
`;

const Cell = styled.div<{ status: 'empty' | 'filled' | 'correct' | 'present' | 'absent' }>`
  width: 50px;
  height: 50px;
  border: 2px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  text-transform: uppercase;
  background-color: ${({ status }) => {
    switch (status) {
      case 'correct':
        return '#6aaa64';
      case 'present':
        return '#c9b458';
      case 'absent':
        return '#787c7e';
      default:
        return 'white';
    }
  }};
  color: ${({ status }) => (status === 'empty' || status === 'filled' ? 'black' : 'white')};
`;

const Message = styled.p`
  font-size: 1.2rem;
  margin-top: 1rem;
  font-weight: bold;
`;

interface WordleGameProps {
  initialMaxAttempts?: number;
  initialWordList?: string[];
}

const defaultWordList = ['REACT', 'SWIFT', 'SCALA', 'UNITY', 'KOTLIN', 'PYTHON', 'WORDLE'];

const WordleGame: React.FC<WordleGameProps> = ({
  initialMaxAttempts = 6,
  initialWordList = defaultWordList,
}) => {
  const [targetWord, setTargetWord] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');
  const [letterStatuses, setLetterStatuses] = useState<Record<string, 'correct' | 'present' | 'absent' | undefined>>({});
  const [showSettings, setShowSettings] = useState(false);
  const [maxAttempts, setMaxAttempts] = useState(initialMaxAttempts);
  const [wordList, setWordList] = useState(initialWordList);

  useEffect(() => {
    setTargetWord(wordList[Math.floor(Math.random() * wordList.length)]);
  }, [wordList]);

  const settingsInputRef = useRef<HTMLTextAreaElement>(null);
  
  const handleKeyPress = useCallback((key: string) => {
    if (gameOver || showSettings) return;

    if (key === 'BACKSPACE') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (key === 'ENTER') {
      handleSubmitGuess();
    } else if (key.length === 1 && /^[A-Z]$/.test(key) && currentGuess.length < 5) {
      setCurrentGuess(prev => prev + key);
    }
  }, [gameOver, showSettings, currentGuess]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showSettings && settingsInputRef.current && settingsInputRef.current === document.activeElement) {
        return;
      }

      if (e.key === 'Backspace') {
        handleKeyPress('BACKSPACE');
      } else if (e.key === 'Enter') {
        handleKeyPress('ENTER');
      } else if (e.key.length === 1 && /^[a-zA-Z]$/.test(e.key)) {
        handleKeyPress(e.key.toUpperCase());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyPress, showSettings]);

  const handleSubmitGuess = () => {
    if (currentGuess.length !== 5) {
      setMessage('Please enter a 5-letter word.');
      return;
    }

    if (!wordList.includes(currentGuess)) {
      setMessage('Word not in the allowed list.');
      return;
    }

    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);

    // Update letter statuses
    const newLetterStatuses = { ...letterStatuses };
    for (let i = 0; i < 5; i++) {
      const letter = currentGuess[i];
      const status = getLetterStatus(letter, i, currentGuess);
      if (status === 'correct' || (status === 'present' && newLetterStatuses[letter] !== 'correct') || (status === 'absent' && !newLetterStatuses[letter])) {
        newLetterStatuses[letter] = status;
      }
    }
    setLetterStatuses(newLetterStatuses);

    setCurrentGuess('');
    setMessage('');

    if (currentGuess === targetWord) {
      setGameOver(true);
      setMessage('Congratulations! You guessed the word!');
    } else if (newGuesses.length >= maxAttempts) {
      setGameOver(true);
      setMessage(`Game over! The word was ${targetWord}.`);
    }
  };

  const getLetterStatus = (letter: string, index: number, guess: string) => {
    if (letter === targetWord[index]) {
      return 'correct';
    } else if (targetWord.includes(letter)) {
      return 'present';
    } else {
      return 'absent';
    }
  };

  const handleSaveSettings = (newMaxAttempts: number, newWordList: string[]) => {
    setMaxAttempts(newMaxAttempts);
    setWordList(newWordList);
    setShowSettings(false);
    // Reset the game
    setGuesses([]);
    setCurrentGuess('');
    setGameOver(false);
    setMessage('');
    setLetterStatuses({});
    setTargetWord(newWordList[Math.floor(Math.random() * newWordList.length)]);
  };

  return (
    <GameContainer>
      <Header>
        <Title>..</Title>
        <SettingsButton onClick={() => setShowSettings(true)}>Settings</SettingsButton>
      </Header>
      <Grid>
        {Array.from({ length: maxAttempts }).map((_, rowIndex) => (
          <React.Fragment key={rowIndex}>
            {Array.from({ length: 5 }).map((_, colIndex) => {
              const letter = guesses[rowIndex]?.[colIndex] || (rowIndex === guesses.length ? currentGuess[colIndex] : '');
              const status =
                guesses[rowIndex]
                  ? getLetterStatus(letter, colIndex, guesses[rowIndex])
                  : letter
                  ? 'filled'
                  : 'empty';
              return <Cell key={colIndex} status={status}>{letter}</Cell>;
            })}
          </React.Fragment>
        ))}
      </Grid>
      {message && <Message>{message}</Message>}
      <VirtualKeyboard onKeyPress={handleKeyPress} letterStatuses={letterStatuses} />
      {showSettings && (
        <SettingsModal
          show={showSettings}
          onClose={() => setShowSettings(false)}
          onSave={handleSaveSettings}
          currentMaxAttempts={maxAttempts}
          currentWordList={wordList}
          inputRef={settingsInputRef}
        />
      )}
    </GameContainer>
  );
};

interface SettingsModalProps {
  show: boolean;
  onClose: () => void;
  onSave: (maxAttempts: number, wordList: string[]) => void;
  currentMaxAttempts: number;
  currentWordList: string[];
  inputRef: React.RefObject<HTMLTextAreaElement>;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  show,
  onClose,
  onSave,
  currentMaxAttempts,
  currentWordList,
  inputRef,
}) => {
  const [maxAttempts, setMaxAttempts] = useState(currentMaxAttempts);
  const [wordList, setWordList] = useState(currentWordList.join('\n'));

  const handleSave = () => {
    const newWordList = wordList
      .split('\n')
      .map(word => word.trim().toUpperCase())
      .filter(word => word.length === 5);
    onSave(maxAttempts, newWordList);
  };

  if (!show) return null;

  return (
    <Modal>
      <ModalContent>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <h2>Settings</h2>
        <div>
          <label>
            Max Attempts:
            <input
              type="number"
              value={maxAttempts}
              onChange={(e) => setMaxAttempts(Number(e.target.value))}
              min="1"
            />
          </label>
        </div>
        <div>
          <label>
            Word List (one word per line):
            <textarea
              ref={inputRef}
              value={wordList}
              onChange={(e) => setWordList(e.target.value)}
              rows={10}
            />
          </label>
        </div>
        <button onClick={handleSave}>Save</button>
      </ModalContent>
    </Modal>
  );
};

export default WordleGame;