import React, { useState } from 'react';
import styled from '@emotion/styled';

const Modal = styled.div`
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
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

  &:hover,
  &:focus {
    color: #000;
    text-decoration: none;
    cursor: pointer;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 5px;
  margin-top: 5px;
`;

const Button = styled.button`
  background-color: #4CAF50;
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin-top: 10px;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    opacity: 0.8;
  }
`;

interface JoinGameModalProps {
  show: boolean;
  onClose: () => void;
  onJoin: (roomId: string, playerName: string) => void;
}

const JoinGameModal: React.FC<JoinGameModalProps> = ({ show, onClose, onJoin }) => {
  const [roomId, setRoomId] = useState('');
  const [playerName, setPlayerName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId && playerName) {
      onJoin(roomId, playerName);
    }
  };

  if (!show) return null;

  return (
    <Modal>
      <ModalContent>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <h2>Join Game</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Room ID:
              <Input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Player Name:
              <Input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                required
              />
            </label>
          </div>
          <Button type="submit">Join</Button>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default JoinGameModal;