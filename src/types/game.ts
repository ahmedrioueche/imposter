export type GameDigitLength = 2 | 3 | 4 | 5;

export type GuessResult = {
  id: string;
  guess: string;
  score: number;
  exactMatches: number;
  partialMatches: number;
  timestamp: Date;
};

export type GameOptions = {
  allowRepeatedDigits: boolean;
  useTimer: boolean;
  showExactPartial: boolean;
  autoSubmit: boolean;
  timerDuration: number; // in seconds
};

export type GameState = {
  targetNumber: string;
  digitLength: GameDigitLength;
  isNumberVisible: boolean;
  guesses: GuessResult[];
  isGameActive: boolean;
  options: GameOptions;
  startTime?: Date;
  elapsedTime?: number;
  timerRemaining?: number;
  isTimerExpired?: boolean;
  hasWon?: boolean;
};

export type GameMode = 'auto' | 'manual';
