'use client';

import React from 'react';
import styled from '@emotion/styled';
import WordleGame from '../components/WordleGame';

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

export default function Home() {
  return (
    <Container>
      <Title>Wordle</Title>
      <WordleGame />
    </Container>
  );
}