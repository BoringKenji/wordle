import React, { useEffect, useState } from 'react';
import './SettingsModal.css';

interface SettingsModalProps {
  show: boolean;
  onClose: () => void;
  onSave: (maxAttempts: number, wordList: string[], hostCheating: boolean) => void;
  currentMaxAttempts: number;
  currentWordList: string[];
  currentHostCheating: boolean;
  inputRef: React.RefObject<HTMLTextAreaElement>;
  isMultiplayer?: boolean;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  show,
  onClose,
  onSave,
  currentMaxAttempts,
  currentWordList,
  currentHostCheating,
  inputRef,
  isMultiplayer = false,
}) => {
  const [maxAttempts, setMaxAttempts] = useState(currentMaxAttempts);
  const [wordList, setWordList] = useState(currentWordList.join('\n'));
  const [hostCheating, setHostCheating] = useState(currentHostCheating);
  const [warningMessages, setWarningMessages] = useState<string[]>([]);
  const [playerName, setPlayerName] = useState('');

  useEffect(() => {
    setWordList(currentWordList.join('\n'));
  }, [currentWordList]);
  
  const handleSave = () => {
    const warnings: string[] = [];

    // Check max attempts
    if (maxAttempts < 1) {
      warnings.push("Max attempts must be larger than 1.");
    }

    // Check word list
    const newWordList = wordList
      .split('\n')
      .map(word => word.trim().toUpperCase())
      .filter(word => word.length > 0);

    const invalidWords = newWordList.filter(word => word.length !== 5);

    if (invalidWords.length > 0) {
      warnings.push(`All words must be 5 letters long. Invalid words: ${invalidWords.join(', ')}`);
    }

    if (isMultiplayer && playerName.trim() === '') {
      warnings.push("Player name is required for multiplayer games.");
    }

    if (warnings.length > 0) {
      setWarningMessages(warnings);
    } else {
      setWarningMessages([]);
      onSave(maxAttempts, newWordList, hostCheating);
    }
  };

  if (!show) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>&times;</span>
        <h2>Settings</h2>
        {isMultiplayer && (
          <div>
            <label>
              Player Name:
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                required
              />
            </label>
          </div>
        )}
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
        <div>
          <label>
            <input
              type="checkbox"
              checked={hostCheating}
              onChange={(e) => setHostCheating(e.target.checked)}
            />
            Enable Host Cheating (Absurdle mode)
          </label>
        </div>
        {warningMessages.length > 0 && (
          <div className="warning-messages">
            {warningMessages.map((message, index) => (
              <p key={index} className="warning-message">{message}</p>
            ))}
          </div>
        )}
        <button onClick={handleSave}>Save</button>
      </div>
    </div>
  );
};

export default SettingsModal;