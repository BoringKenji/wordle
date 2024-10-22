import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import WordleGame from '../WordleGame/WordleGame';
import SettingsModal from '../SettingsModal/SettingsModal';
import JoinGameModal from '../JoinGameModal/JoinGameModal';
import PlayerList from '../PlayerList/PlayerList';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
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
  margin: 10px 5px;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    opacity: 0.8;
  }
`;

interface Player {
  id: string;
  name: string;
  ready: boolean;
}

const MultiplayerWordleGame: React.FC = () => {
  const [gameMode, setGameMode] = useState<'create' | 'join' | 'play' | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);

  const handleCreateGame = () => {
    setGameMode('create');
    setShowSettings(true);
  };

  const handleJoinGame = () => {
    setGameMode('join');
    setShowJoinModal(true);
  };

  const handleSaveSettings = (maxAttempts: number, wordList: string[], hostCheating: boolean) => {
    // TODO: Implement backend logic to create a new game room
    const mockRoomId = 'ABCD1234';
    setRoomId(mockRoomId);
    setShowSettings(false);
    setGameMode('play');
    
    // Mock current player
    const mockPlayer = { id: '1', name: 'Player 1', ready: true };
    setCurrentPlayer(mockPlayer);
    setPlayers([mockPlayer]);
  };

  const handleJoinGameSubmit = (joinRoomId: string, playerName: string) => {
    // TODO: Implement backend logic to join an existing game room
    setRoomId(joinRoomId);
    setShowJoinModal(false);
    setGameMode('play');

    // Mock current player and other players
    const mockCurrentPlayer = { id: '2', name: playerName, ready: false };
    const mockPlayers = [
      { id: '1', name: 'Host', ready: true },
      mockCurrentPlayer,
    ];
    setCurrentPlayer(mockCurrentPlayer);
    setPlayers(mockPlayers);
  };

  const handlePlayerReady = () => {
    if (currentPlayer) {
      const updatedPlayer = { ...currentPlayer, ready: true };
      setCurrentPlayer(updatedPlayer);
      setPlayers(players.map(p => p.id === updatedPlayer.id ? updatedPlayer : p));
      // TODO: Implement backend logic to update player ready status
    }
  };

  const allPlayersReady = players.every(player => player.ready);

  return (
    <Container>
      {gameMode === null && (
        <>
          <Button onClick={handleCreateGame}>Create Game</Button>
          <Button onClick={handleJoinGame}>Join Game</Button>
        </>
      )}
      {gameMode === 'play' && (
        <>
          <h2>Room ID: {roomId}</h2>
          <PlayerList players={players} currentPlayerId={currentPlayer?.id} />
          {!currentPlayer?.ready && <Button onClick={handlePlayerReady}>Ready</Button>}
          {allPlayersReady ? (
            <WordleGame isMultiplayer={true} />
          ) : (
            <p>Waiting for all players to be ready...</p>
          )}
        </>
      )}
      {showSettings && (
        <SettingsModal
          show={showSettings}
          onClose={() => setShowSettings(false)}
          onSave={handleSaveSettings}
          currentMaxAttempts={6}
          currentWordList={[]}
          currentHostCheating={false}
          isMultiplayer={true}
        />
      )}
      {showJoinModal && (
        <JoinGameModal
          show={showJoinModal}
          onClose={() => setShowJoinModal(false)}
          onJoin={handleJoinGameSubmit}
        />
      )}
    </Container>
  );
};

export default MultiplayerWordleGame;