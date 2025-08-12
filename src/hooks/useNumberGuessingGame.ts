import { useState, useCallback } from 'react';
import { GameState, GuessResult, GameDigitLength, GameMode } from '@/types/game';
import { SCORING_RULES } from '@/constants/game';

const generateRandomNumber = (length: GameDigitLength): string => {
  let result = '';
  for (let i = 0; i < length; i++) {
    // First digit shouldn't be 0 to avoid confusion
    const digit = i === 0 ? Math.floor(Math.random() * 9) + 1 : Math.floor(Math.random() * 10);
    result += digit.toString();
  }
  return result;
};

const calculateScore = (target: string, guess: string): GuessResult => {
  const targetDigits = target.split('');
  const guessDigits = guess.split('');

  let exactMatches = 0;
  let partialMatches = 0;

  // Track which positions we've already counted
  const targetUsed = new Array(target.length).fill(false);
  const guessUsed = new Array(guess.length).fill(false);

  // First pass: count exact matches
  for (let i = 0; i < Math.min(targetDigits.length, guessDigits.length); i++) {
    if (targetDigits[i] === guessDigits[i]) {
      exactMatches++;
      targetUsed[i] = true;
      guessUsed[i] = true;
    }
  }

  // Second pass: count partial matches
  for (let i = 0; i < guessDigits.length; i++) {
    if (!guessUsed[i]) {
      for (let j = 0; j < targetDigits.length; j++) {
        if (!targetUsed[j] && targetDigits[j] === guessDigits[i]) {
          partialMatches++;
          targetUsed[j] = true;
          break;
        }
      }
    }
  }

  const score =
    exactMatches * SCORING_RULES.EXACT_MATCH + partialMatches * SCORING_RULES.PARTIAL_MATCH;

  return {
    id: Date.now().toString(),
    guess,
    score,
    exactMatches,
    partialMatches,
    timestamp: new Date(),
  };
};

export const useNumberGuessingGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    targetNumber: '',
    digitLength: 3,
    isNumberVisible: false,
    guesses: [],
    isGameActive: false,
  });

  const startNewGame = useCallback(
    (mode: GameMode, digitLength: GameDigitLength, manualNumber?: string) => {
      const targetNumber = mode === 'auto' ? generateRandomNumber(digitLength) : manualNumber || '';

      setGameState({
        targetNumber,
        digitLength,
        isNumberVisible: mode === 'manual', // Show number immediately for manual entry
        guesses: [],
        isGameActive: true,
      });
    },
    []
  );

  const toggleNumberVisibility = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      isNumberVisible: !prev.isNumberVisible,
    }));
  }, []);

  const submitGuess = useCallback(
    (guess: string): GuessResult | null => {
      if (!gameState.isGameActive || !gameState.targetNumber) {
        return null;
      }

      // Validate guess
      if (guess.length !== gameState.digitLength || !/^\d+$/.test(guess)) {
        return null;
      }

      const result = calculateScore(gameState.targetNumber, guess);

      setGameState((prev) => ({
        ...prev,
        guesses: [result, ...prev.guesses],
      }));

      return result;
    },
    [gameState.isGameActive, gameState.targetNumber, gameState.digitLength]
  );

  const resetGame = useCallback(() => {
    setGameState({
      targetNumber: '',
      digitLength: 3,
      isNumberVisible: false,
      guesses: [],
      isGameActive: false,
    });
  }, []);

  const setDigitLength = useCallback((length: GameDigitLength) => {
    setGameState((prev) => ({
      ...prev,
      digitLength: length,
    }));
  }, []);

  return {
    gameState,
    startNewGame,
    toggleNumberVisibility,
    submitGuess,
    resetGame,
    setDigitLength,
  };
};
