'use client';

import React, { useState } from 'react';
import styled from '@emotion/styled';
import WordleGame from '../components/WordleGame/WordleGame';
import MultiplayerWordleGame from '../components/MultiplayerWordleGame/MultiplayerWordleGame';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  padding: 2rem 0;
  background-color: #f0f0f0;
  font-family: Arial, sans-serif;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #333;
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

export default function Home() {
  const [gameMode, setGameMode] = useState<'single' | 'multi' | null>(null);

  return (
    <Container>
      <Title>Wordle</Title>
      {gameMode === null && (
        <>
          <Button onClick={() => setGameMode('single')}>Single Player</Button>
          <Button onClick={() => setGameMode('multi')}>Multiplayer</Button>
        </>
      )}
      {gameMode === 'single' && <WordleGame />}
      {gameMode === 'multi' && <MultiplayerWordleGame />}
    </Container>
  );
}