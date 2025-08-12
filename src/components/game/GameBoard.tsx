import React, { useState } from 'react';
import { Eye, EyeOff, RotateCcw, Send } from 'lucide-react';
import { GameState, GuessResult } from '@/types/game';
import { GAME_MESSAGES } from '@/constants/game';
import Button from '@/components/ui/Button';
import InputField from '@/components/ui/InputField';
import Card from '@/components/ui/Card';

interface GameBoardProps {
  gameState: GameState;
  onToggleVisibility: () => void;
  onSubmitGuess: (guess: string) => GuessResult | null;
  onNewGame: () => void;
}

const GameBoard: React.FC<GameBoardProps> = ({
  gameState,
  onToggleVisibility,
  onSubmitGuess,
  onNewGame,
}) => {
  const [currentGuess, setCurrentGuess] = useState('');
  const [error, setError] = useState('');

  const handleSubmitGuess = () => {
    setError('');

    if (
      !currentGuess ||
      currentGuess.length !== gameState.digitLength ||
      !/^\d+$/.test(currentGuess)
    ) {
      setError(GAME_MESSAGES.INVALID_GUESS);
      return;
    }

    const result = onSubmitGuess(currentGuess);
    if (result) {
      setCurrentGuess('');
    }
  };

  const handleNewGame = () => {
    if (gameState.guesses.length > 0) {
      if (window.confirm(GAME_MESSAGES.NEW_GAME_CONFIRM)) {
        onNewGame();
      }
    } else {
      onNewGame();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmitGuess();
    }
  };

  return (
    <div className='space-y-4 sm:space-y-6'>
      {/* Target Number Display */}
      <Card className='p-4 sm:p-6'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4'>
          <h3 className='text-lg font-semibold text-light-text-primary dark:text-dark-text-primary'>
            {GAME_MESSAGES.TARGET_NUMBER}
          </h3>
          <div className='flex gap-2'>
            <Button
              variant='ghost'
              size='sm'
              onClick={onToggleVisibility}
              icon={gameState.isNumberVisible ? <EyeOff size={16} /> : <Eye size={16} />}
              className='flex-1 sm:flex-none text-xs sm:text-sm'
            >
              <span className='hidden sm:inline'>
                {gameState.isNumberVisible ? GAME_MESSAGES.HIDE_NUMBER : GAME_MESSAGES.SHOW_NUMBER}
              </span>
              <span className='sm:hidden'>{gameState.isNumberVisible ? 'Hide' : 'Show'}</span>
            </Button>
            <Button
              variant='ghost'
              size='sm'
              onClick={handleNewGame}
              icon={<RotateCcw size={16} />}
              className='flex-1 sm:flex-none text-xs sm:text-sm'
            >
              <span className='hidden sm:inline'>New Game</span>
              <span className='sm:hidden'>New</span>
            </Button>
          </div>
        </div>

        <div className='text-center'>
          <div className='inline-flex items-center justify-center bg-light-background dark:bg-dark-accent border-2 border-dashed border-light-border dark:border-dark-border rounded-lg px-4 py-3 sm:px-6 sm:py-4 min-w-[120px]'>
            <span className='text-xl sm:text-2xl font-mono font-bold text-light-text-primary dark:text-dark-text-primary tracking-wider'>
              {gameState.isNumberVisible
                ? gameState.targetNumber
                : '•'.repeat(gameState.digitLength)}
            </span>
          </div>
        </div>
      </Card>

      {/* Guess Input */}
      <Card className='p-4 sm:p-6'>
        <h3 className='text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-4'>
          Make Your Guess
        </h3>
        <div className='flex flex-col sm:flex-row gap-3'>
          <div className='flex-1'>
            <InputField
              value={currentGuess}
              onChange={(e) => setCurrentGuess(e.target.value)}
              placeholder={`Enter ${gameState.digitLength}-digit number`}
              maxLength={gameState.digitLength}
              onKeyDown={handleKeyDown}
              error={error}
              className='text-center sm:text-left font-mono text-lg'
            />
          </div>
          <Button
            variant='primary'
            onClick={handleSubmitGuess}
            disabled={!currentGuess}
            icon={<Send size={16} />}
            className='w-full sm:w-auto sm:px-6'
          >
            <span className='hidden sm:inline'>{GAME_MESSAGES.SUBMIT_GUESS}</span>
            <span className='sm:hidden'>Submit</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default GameBoard;
