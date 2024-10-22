// components/PlayerList/PlayerList.tsx

import React from 'react';
import styled from '@emotion/styled';

const PlayerListContainer = styled.div`
  margin-bottom: 20px;
`;

const PlayerItem = styled.div<{ isCurrentPlayer: boolean; isReady: boolean }>`
  padding: 5px 10px;
  margin: 5px 0;
  background-color: ${props => props.isCurrentPlayer ? '#e0e0e0' : 'transparent'};
  border: 1px solid #ccc;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ReadyStatus = styled.span<{ isReady: boolean }>`
  color: ${props => props.isReady ? 'green' : 'red'};
  font-weight: bold;
`;

interface Player {
  id: string;
  name: string;
  ready: boolean;
}

interface PlayerListProps {
  players: Player[];
  currentPlayerId: string | undefined;
}

const PlayerList: React.FC<PlayerListProps> = ({ players, currentPlayerId }) => {
  return (
    <PlayerListContainer>
      <h3>Players:</h3>
      {players.map(player => (
        <PlayerItem key={player.id} isCurrentPlayer={player.id === currentPlayerId} isReady={player.ready}>
          <span>{player.name} {player.id === currentPlayerId && '(You)'}</span>
          <ReadyStatus isReady={player.ready}>{player.ready ? 'Ready' : 'Not Ready'}</ReadyStatus>
        </PlayerItem>
      ))}
    </PlayerListContainer>
  );
};

export default PlayerList;