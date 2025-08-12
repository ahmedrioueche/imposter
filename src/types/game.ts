export type GameDigitLength = 2 | 3 | 4 | 5;

export type GuessResult = {
  id: string;
  guess: string;
  score: number;
  exactMatches: number;
  partialMatches: number;
  timestamp: Date;
};

export type GameState = {
  targetNumber: string;
  digitLength: GameDigitLength;
  isNumberVisible: boolean;
  guesses: GuessResult[];
  isGameActive: boolean;
};

export type GameMode = 'auto' | 'manual';
