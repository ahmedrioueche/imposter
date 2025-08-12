'use client';

import React from 'react';
import { useNumberGuessingGame } from '@/hooks/useNumberGuessingGame';
import { useTheme } from '@/hooks/useTheme';
import GameSetup from '@/components/game/GameSetup';
import GameBoard from '@/components/game/GameBoard';
import GuessHistory from '@/components/game/GuessHistory';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function Page() {
  const {
    gameState,
    startNewGame,
    toggleNumberVisibility,
    submitGuess,
    resetGame,
    setDigitLength,
  } = useNumberGuessingGame();

  const { theme, toggleTheme } = useTheme();

  return (
    <div className='min-h-screen bg-light-background dark:bg-dark-background transition-colors'>
      {/* Header */}
      <header className='border-b border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card'>
        <div className='max-w-4xl mx-auto px-4 py-4 flex items-center justify-between'>
          <h1 className='font-dancing text-2xl font-bold text-light-text-primary dark:text-dark-text-primary'>
            Number Guesser
          </h1>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>
      </header>

      {/* Main Content */}
      <main className='max-w-4xl mx-auto px-4 py-8'>
        {!gameState.isGameActive ? (
          <div className='max-w-md mx-auto'>
            <GameSetup
              onStartGame={startNewGame}
              digitLength={gameState.digitLength}
              onDigitLengthChange={setDigitLength}
            />
          </div>
        ) : (
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            <div className='space-y-6'>
              <GameBoard
                gameState={gameState}
                onToggleVisibility={toggleNumberVisibility}
                onSubmitGuess={submitGuess}
                onNewGame={resetGame}
              />
            </div>

            <div>
              <GuessHistory guesses={gameState.guesses} />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className='border-t border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card mt-12'>
        <div className='max-w-4xl mx-auto px-4 py-6 text-center'>
          <p className='text-light-text-secondary dark:text-dark-text-secondary text-sm'>
            Guess the number! Exact matches = 1 point, Partial matches = 0.5 points
          </p>
        </div>
      </footer>
    </div>
  );
}
