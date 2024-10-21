import React from 'react';
import './VirtualKeyboard.css';

const keyboardLayout = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'],
];

interface VirtualKeyboardProps {
  onKeyPress: (key: string) => void;
  letterStatuses: Record<string, 'correct' | 'present' | 'absent' | undefined>;
}

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ onKeyPress, letterStatuses }) => {
  return (
    <div className="keyboard-container">
      {keyboardLayout.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((key) => (
            <button
              key={key}
              className={`key ${letterStatuses[key] || ''}`}
              onClick={() => onKeyPress(key)}
            >
              {key === 'BACKSPACE' ? '←' : key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default VirtualKeyboard;