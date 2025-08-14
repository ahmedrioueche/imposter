import { useState, useCallback, useEffect } from 'react';
import { GameState, GuessResult, GameDigitLength, GameMode, GameOptions } from '@/types/game';
import { SCORING_RULES } from '@/constants/game';

const generateRandomNumber = (length: GameDigitLength, allowRepeated: boolean): string => {
  if (allowRepeated) {
    let result = '';
    for (let i = 0; i < length; i++) {
      // First digit shouldn't be 0 to avoid confusion
      const digit = i === 0 ? Math.floor(Math.random() * 9) + 1 : Math.floor(Math.random() * 10);
      result += digit.toString();
    }
    return result;
  } else {
    // Generate number without repeated digits
    const availableDigits = [1, 2, 3, 4, 5, 6, 7, 8, 9]; // First digit can't be 0
    let result = '';

    // First digit
    const firstDigitIndex = Math.floor(Math.random() * availableDigits.length);
    result += availableDigits[firstDigitIndex].toString();
    availableDigits.splice(firstDigitIndex, 1);
    availableDigits.push(0); // Now 0 can be used for subsequent digits

    // Remaining digits
    for (let i = 1; i < length; i++) {
      if (availableDigits.length === 0) break;
      const digitIndex = Math.floor(Math.random() * availableDigits.length);
      result += availableDigits[digitIndex].toString();
      availableDigits.splice(digitIndex, 1);
    }

    return result;
  }
};

const calculateScore = (target: string, guess: string): GuessResult => {
  const targetDigits = target.split('');
  const guessDigits = guess.split('');

  let exactMatches = 0;
  let partialMatches = 0;

  // Count frequency of each digit in target and guess (excluding exact matches)
  const targetFreq: { [key: string]: number } = {};
  const guessFreq: { [key: string]: number } = {};

  // First pass: count exact matches and build frequency maps for non-exact positions
  for (let i = 0; i < Math.min(targetDigits.length, guessDigits.length); i++) {
    if (targetDigits[i] === guessDigits[i]) {
      exactMatches++;
    } else {
      // Add to frequency count for partial matching
      targetFreq[targetDigits[i]] = (targetFreq[targetDigits[i]] || 0) + 1;
      guessFreq[guessDigits[i]] = (guessFreq[guessDigits[i]] || 0) + 1;
    }
  }

  // Second pass: count partial matches based on frequency overlap
  for (const digit in guessFreq) {
    if (targetFreq[digit]) {
      // For each digit, the partial matches is the minimum of occurrences in both numbers
      partialMatches += Math.min(guessFreq[digit], targetFreq[digit]);
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
    isNumberVisible: true,
    guesses: [],
    isGameActive: false,
    options: {
      allowRepeatedDigits: false,
      useTimer: true,
      showExactPartial: false,
      autoSubmit: true,
      timerDuration: 20,
    },
  });

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (
      gameState.isGameActive &&
      gameState.options.useTimer &&
      gameState.timerRemaining !== undefined
    ) {
      interval = setInterval(() => {
        setGameState((prev) => {
          const newTimeRemaining = (prev.timerRemaining || 0) - 1;

          if (newTimeRemaining <= 0) {
            // Timer expired - play 5 seconds of loser sound and reset timer
            const audio = new Audio('/audio/loser.mp3');
            audio.play().catch(console.error);

            // Stop audio after 5 seconds
            setTimeout(() => {
              audio.pause();
              audio.currentTime = 0;
            }, 5000);

            return {
              ...prev,
              timerRemaining: prev.options.timerDuration, // Reset timer to full duration
              isTimerExpired: false, // Don't mark as expired since game continues
            };
          }

          return {
            ...prev,
            timerRemaining: newTimeRemaining,
          };
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState.isGameActive, gameState.options.useTimer, gameState.timerRemaining]);

  const startNewGame = useCallback(
    (mode: GameMode, digitLength: GameDigitLength, options: GameOptions, manualNumber?: string) => {
      const targetNumber =
        mode === 'auto'
          ? generateRandomNumber(digitLength, options.allowRepeatedDigits)
          : manualNumber || '';

      setGameState({
        targetNumber,
        digitLength,
        isNumberVisible: mode === 'manual', // Show number immediately for manual entry
        guesses: [],
        isGameActive: true,
        options,
        startTime: options.useTimer ? new Date() : undefined,
        elapsedTime: 0,
        timerRemaining: options.useTimer ? options.timerDuration : undefined,
        isTimerExpired: false,
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
      const isWinning = result.exactMatches === gameState.digitLength;

      setGameState((prev) => {
        const newState = {
          ...prev,
          guesses: [result, ...prev.guesses],
          // Reset timer on each guess if timer is enabled
          timerRemaining: prev.options.useTimer ? prev.options.timerDuration : prev.timerRemaining,
        };

        // Handle winning - play sound but keep game active
        if (isWinning) {
          const audio = new Audio('/audio/yay.mp3');
          audio.play().catch(console.error);
          // Game continues - don't set isGameActive to false
        }

        return newState;
      });

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
      options: {
        allowRepeatedDigits: false,
        useTimer: true,
        showExactPartial: false,
        autoSubmit: true,
        timerDuration: 20,
      },
      timerRemaining: undefined,
      isTimerExpired: false,
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
