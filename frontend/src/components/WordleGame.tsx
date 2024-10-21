import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from '@emotion/styled';
import VirtualKeyboard from './VirtualKeyboard';
import axios from 'axios';

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

interface CellProps {
  status: 'empty' | 'filled' | 'correct' | 'present' | 'absent';
  children?: React.ReactNode;
}

const Cell = styled.div<CellProps>`
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
}

interface GuessData {
  word: string;
  letterStatuses: ('correct' | 'present' | 'absent')[];
}

function isValidStatus(status: string): status is 'empty' | 'filled' | 'correct' | 'present' | 'absent' {
  return ['empty', 'filled', 'correct', 'present', 'absent'].includes(status);
}

function mapStatus(status: string): 'empty' | 'filled' | 'correct' | 'present' | 'absent' {
  if (isValidStatus(status)) {
    return status;
  }
  console.warn(`Invalid status: ${status}. Defaulting to 'empty'.`);
  return 'empty';
}

const WordleGame: React.FC<WordleGameProps> = ({
  initialMaxAttempts = 6,
}) => {
  const [gameId, setGameId] = useState('');
  const [guesses, setGuesses] = useState<GuessData[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');
  const [letterStatuses, setLetterStatuses] = useState<Record<string, 'correct' | 'present' | 'absent' | undefined>>({});
  const [showSettings, setShowSettings] = useState(false);
  const [maxAttempts, setMaxAttempts] = useState(initialMaxAttempts);

  const settingsInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = async () => {
    try {
      const response = await axios.post('http://localhost:8080/new-game');
      setGameId(response.data.gameId);
      setMaxAttempts(response.data.maxAttempts);
      resetGame();
    } catch (error) {
      console.error('Error starting new game:', error);
    }
  };

  const resetGame = () => {
    setGuesses([]);
    setCurrentGuess('');
    setGameOver(false);
    setMessage('');
    setLetterStatuses({});
  };

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

  const handleSubmitGuess = async () => {
    if (currentGuess.length !== 5) {
      setMessage('Please enter a 5-letter word.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/guess', {
        gameId,
        guess: currentGuess,
      });

      const { guesses: serverGuesses, gameOver, message, letterStatuses: serverLetterStatuses } = response.data;

      // Update guesses with the new guess data
      const newGuessData: GuessData = {
        word: currentGuess,
        letterStatuses: serverLetterStatuses as ('correct' | 'present' | 'absent')[],
      };
      setGuesses(prevGuesses => [...prevGuesses, newGuessData]);

      setGameOver(gameOver);
      setMessage(message);

      // Update overall letter statuses for the keyboard
      const newLetterStatuses = { ...letterStatuses };
      for (let i = 0; i < 5; i++) {
        const letter = currentGuess[i].toUpperCase();
        const status = serverLetterStatuses[i] as 'correct' | 'present' | 'absent';
        if (status === 'correct' || (status === 'present' && newLetterStatuses[letter] !== 'correct') || (status === 'absent' && !newLetterStatuses[letter])) {
          newLetterStatuses[letter] = status;
        }
      }
      setLetterStatuses(newLetterStatuses);

      setCurrentGuess('');
    } catch (error) {
      console.error('Error submitting guess:', error);
      setMessage('Error submitting guess. Please try again.');
    }
  };

  const handleSaveSettings = async (newMaxAttempts: number, newWordList: string[]) => {
    try {
      await axios.put('http://localhost:8080/settings', {
        gameId,
        maxAttempts: newMaxAttempts,
        wordList: newWordList,
      });

      setMaxAttempts(newMaxAttempts);
      setShowSettings(false);
      resetGame();
    } catch (error) {
      console.error('Error updating settings:', error);
      setMessage('Error updating settings. Please try again.');
    }
  };

  return (
    <GameContainer>
      <Header>
        <SettingsButton onClick={() => setShowSettings(true)}>Settings</SettingsButton>
      </Header>
      <Grid>
        {Array.from({ length: maxAttempts }).map((_, rowIndex) => (
          <React.Fragment key={rowIndex}>
            {Array.from({ length: 5 }).map((_, colIndex) => {
              const guessData = guesses[rowIndex];
              const letter = guessData?.word[colIndex] || (rowIndex === guesses.length ? currentGuess[colIndex] : '');
              let status: 'empty' | 'filled' | 'correct' | 'present' | 'absent' = 'empty';
              if (guessData) {
                status = guessData.letterStatuses[colIndex];
              } else if (letter) {
                status = 'filled';
              }
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
          currentWordList={[]}
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