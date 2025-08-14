import React, { useState } from 'react';
import { GameDigitLength, GameMode, GameOptions } from '@/types/game';
import { DIGIT_LENGTH_OPTIONS, GAME_MESSAGES } from '@/constants/game';
import Button from '@/components/ui/Button';
import InputField from '@/components/ui/InputField';
import Select from '@/components/ui/Select';
import RadioInput from '@/components/ui/RadioInput';
import Card from '@/components/ui/Card';

interface GameSetupProps {
  onStartGame: (
    mode: GameMode,
    digitLength: GameDigitLength,
    options: GameOptions,
    manualNumber?: string
  ) => void;
  digitLength: GameDigitLength;
  onDigitLengthChange: (length: GameDigitLength) => void;
}

const GameSetup: React.FC<GameSetupProps> = ({ onStartGame, digitLength, onDigitLengthChange }) => {
  const [gameMode, setGameMode] = useState<GameMode>('auto');
  const [manualNumber, setManualNumber] = useState('');
  const [error, setError] = useState('');
  const [gameOptions, setGameOptions] = useState<GameOptions>({
    allowRepeatedDigits: false,
    useTimer: true,
    showExactPartial: false,
    autoSubmit: true,
    timerDuration: 30,
  });

  const handleStartGame = () => {
    setError('');

    if (gameMode === 'manual') {
      if (!manualNumber || manualNumber.length !== digitLength || !/^\d+$/.test(manualNumber)) {
        setError(`Please enter a valid ${digitLength}-digit number`);
        return;
      }
    }

    onStartGame(gameMode, digitLength, gameOptions, manualNumber);
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
              type='number'
              label={GAME_MESSAGES.ENTER_TARGET_NUMBER}
              value={manualNumber}
              onChange={(e) => setManualNumber(e.target.value)}
              placeholder={`Enter ${digitLength}-digit number`}
              maxLength={digitLength}
              error={error}
            />
          </div>
        )}

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          <RadioInput
            label={GAME_MESSAGES.REPEATED_DIGITS}
            name='repeatedDigits'
            value={gameOptions.allowRepeatedDigits ? 'allow' : 'no'}
            options={[
              { value: 'allow', label: GAME_MESSAGES.ALLOW_REPEATED },
              { value: 'no', label: GAME_MESSAGES.NO_REPEATED },
            ]}
            onChange={(value) =>
              setGameOptions((prev) => ({ ...prev, allowRepeatedDigits: value === 'allow' }))
            }
          />

          <RadioInput
            label={GAME_MESSAGES.TIMER_OPTION}
            name='timer'
            value={gameOptions.useTimer ? 'yes' : 'no'}
            options={[
              { value: 'yes', label: GAME_MESSAGES.USE_TIMER },
              { value: 'no', label: GAME_MESSAGES.NO_TIMER },
            ]}
            onChange={(value) => setGameOptions((prev) => ({ ...prev, useTimer: value === 'yes' }))}
          />

          <RadioInput
            label={GAME_MESSAGES.FEEDBACK_DISPLAY}
            name='feedback'
            value={gameOptions.showExactPartial ? 'show' : 'hide'}
            options={[
              { value: 'show', label: GAME_MESSAGES.SHOW_EXACT_PARTIAL },
              { value: 'hide', label: GAME_MESSAGES.HIDE_EXACT_PARTIAL },
            ]}
            onChange={(value) =>
              setGameOptions((prev) => ({ ...prev, showExactPartial: value === 'show' }))
            }
          />

          <RadioInput
            label={GAME_MESSAGES.AUTO_SUBMIT}
            name='autoSubmit'
            value={gameOptions.autoSubmit ? 'enable' : 'disable'}
            options={[
              { value: 'enable', label: GAME_MESSAGES.ENABLE_AUTO_SUBMIT },
              { value: 'disable', label: GAME_MESSAGES.DISABLE_AUTO_SUBMIT },
            ]}
            onChange={(value) =>
              setGameOptions((prev) => ({ ...prev, autoSubmit: value === 'enable' }))
            }
          />
        </div>

        {gameOptions.useTimer && (
          <div>
            <InputField
              type='number'
              label={GAME_MESSAGES.TIMER_DURATION}
              value={gameOptions.timerDuration.toString()}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 20;
                setGameOptions((prev) => ({
                  ...prev,
                  timerDuration: Math.max(5, Math.min(300, value)),
                }));
              }}
              placeholder='30'
              min={5}
              max={300}
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
