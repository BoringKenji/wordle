import React, { useState } from 'react';
import './SettingsModal.css';

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
    <div className="modal">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>&times;</span>
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
      </div>
    </div>
  );
};

export default SettingsModal;