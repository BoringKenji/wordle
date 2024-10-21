import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import VirtualKeyboard from '../VirtualKeyboard/VirtualKeyboard';
import SettingsModal from '../SettingsModal/SettingsModal';
import './WordleGame.css';

interface WordleGameProps {
  initialMaxAttempts?: number;
}

interface GuessData {
  word: string;
  letterStatuses: ('correct' | 'present' | 'absent')[];
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

      const newGuessData: GuessData = {
        word: currentGuess,
        letterStatuses: serverLetterStatuses as ('correct' | 'present' | 'absent')[],
      };
      setGuesses(prevGuesses => [...prevGuesses, newGuessData]);

      setGameOver(gameOver);
      setMessage(message);

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
    <div className="game-container">
      <div className="header">
        <button className="settings-button" onClick={() => setShowSettings(true)}>Settings</button>
      </div>
      <div className="grid">
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
              return <div key={colIndex} className={`cell ${status}`}>{letter}</div>;
            })}
          </React.Fragment>
        ))}
      </div>
      {message && <p className="message">{message}</p>}
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
    </div>
  );
};

export default WordleGame;