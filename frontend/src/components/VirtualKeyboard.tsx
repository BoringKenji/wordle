import React from 'react';
import styled from '@emotion/styled';

const KeyboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1rem;
`;

const KeyboardRow = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 0.5rem;
`;

const Key = styled.button<{ status?: 'correct' | 'present' | 'absent' }>`
  font-size: 1rem;
  font-weight: bold;
  padding: 0.5rem;
  margin: 0 0.25rem;
  min-width: 2rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: ${({ status }) => {
    switch (status) {
      case 'correct':
        return '#6aaa64';
      case 'present':
        return '#c9b458';
      case 'absent':
        return '#787c7e';
      default:
        return '#d3d6da';
    }
  }};
  color: ${({ status }) => (status ? 'white' : 'black')};

  &:hover {
    opacity: 0.8;
  }
`;

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
    <KeyboardContainer>
      {keyboardLayout.map((row, rowIndex) => (
        <KeyboardRow key={rowIndex}>
          {row.map((key) => (
            <Key
              key={key}
              onClick={() => onKeyPress(key)}
              status={letterStatuses[key]}
            >
              {key === 'BACKSPACE' ? '←' : key}
            </Key>
          ))}
        </KeyboardRow>
      ))}
    </KeyboardContainer>
  );
};

export default VirtualKeyboard;