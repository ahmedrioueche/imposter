import React, { useState } from 'react';
import { GameDigitLength, GameMode } from '@/types/game';
import { DIGIT_LENGTH_OPTIONS, GAME_MESSAGES } from '@/constants/game';
import Button from '@/components/ui/Button';
import InputField from '@/components/ui/InputField';
import Select from '@/components/ui/Select';
import Card from '@/components/ui/Card';

interface GameSetupProps {
  onStartGame: (mode: GameMode, digitLength: GameDigitLength, manualNumber?: string) => void;
  digitLength: GameDigitLength;
  onDigitLengthChange: (length: GameDigitLength) => void;
}

const GameSetup: React.FC<GameSetupProps> = ({ onStartGame, digitLength, onDigitLengthChange }) => {
  const [gameMode, setGameMode] = useState<GameMode>('auto');
  const [manualNumber, setManualNumber] = useState('');
  const [error, setError] = useState('');

  const handleStartGame = () => {
    setError('');

    if (gameMode === 'manual') {
      if (!manualNumber || manualNumber.length !== digitLength || !/^\d+$/.test(manualNumber)) {
        setError(`Please enter a valid ${digitLength}-digit number`);
        return;
      }
    }

    onStartGame(gameMode, digitLength, manualNumber);
  };

  const digitLengthOptions = DIGIT_LENGTH_OPTIONS.map((length) => ({
    value: length,
    label: `${length} digits`,
  }));

  return (
    <Card className='p-6 space-y-6'>
      <div className='text-center'>
        <h2 className='text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2'>
          Number Guessing Game
        </h2>
        <p className='text-light-text-secondary dark:text-dark-text-secondary'>
          Set up your game and start guessing!
        </p>
      </div>

      <div className='space-y-4'>
        <div>
          <Select
            label={GAME_MESSAGES.DIGIT_LENGTH}
            value={digitLength}
            onChange={(value) => onDigitLengthChange(Number(value) as GameDigitLength)}
            options={digitLengthOptions}
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2'>
            {GAME_MESSAGES.GAME_MODE}
          </label>
          <div className='flex gap-2'>
            <Button
              variant={gameMode === 'auto' ? 'primary' : 'ghost'}
              onClick={() => setGameMode('auto')}
              className='flex-1'
            >
              {GAME_MESSAGES.AUTO_GENERATE}
            </Button>
            <Button
              variant={gameMode === 'manual' ? 'primary' : 'ghost'}
              onClick={() => setGameMode('manual')}
              className='flex-1'
            >
              {GAME_MESSAGES.MANUAL_ENTRY}
            </Button>
          </div>
        </div>

        {gameMode === 'manual' && (
          <div>
            <InputField
              label={GAME_MESSAGES.ENTER_TARGET_NUMBER}
              value={manualNumber}
              onChange={(e) => setManualNumber(e.target.value)}
              placeholder={`Enter ${digitLength}-digit number`}
              maxLength={digitLength}
              error={error}
            />
          </div>
        )}

        <Button
          variant='primary'
          onClick={handleStartGame}
          className='w-full'
          disabled={gameMode === 'manual' && !manualNumber}
        >
          {GAME_MESSAGES.START_NEW_GAME}
        </Button>
      </div>
    </Card>
  );
};

export default GameSetup;
