import { GameDigitLength } from '@/types/game';

export const DIGIT_LENGTH_OPTIONS: GameDigitLength[] = [2, 3, 4, 5];

export const GAME_MESSAGES = {
  PERFECT_SCORE: 'Perfect! All digits match!',
  GOOD_SCORE: 'Great guess! Getting close!',
  PARTIAL_SCORE: 'Some digits are correct!',
  NO_MATCH: 'No matches, try again!',
  NEW_GAME_CONFIRM: 'Are you sure you want to start a new game? Current progress will be lost.',
  INVALID_GUESS: 'Please enter a valid number.',
  ENTER_TARGET_NUMBER: 'Enter the target number',
  GENERATE_NEW_NUMBER: 'Generate New Number',
  START_NEW_GAME: 'Start New Game',
  HIDE_NUMBER: 'Hide Number',
  SHOW_NUMBER: 'Show Number',
  ENTER_GUESS: 'Enter your guess',
  SUBMIT_GUESS: 'Submit Guess',
  GUESS_HISTORY: 'Guess History',
  NO_GUESSES_YET: 'No guesses yet. Make your first guess!',
  SCORE: 'Score',
  EXACT_MATCHES: 'Exact',
  PARTIAL_MATCHES: 'Partial',
  DIGIT_LENGTH: 'Number Length',
  TARGET_NUMBER: 'Target Number',
  GAME_MODE: 'Game Mode',
  AUTO_GENERATE: 'Auto',
  MANUAL_ENTRY: 'Manual',
  REPEATED_DIGITS: 'Repeated Digits',
  ALLOW_REPEATED: 'Allow',
  NO_REPEATED: 'No Repeated',
  TIMER_OPTION: 'Timer',
  USE_TIMER: 'Use Timer',
  NO_TIMER: 'No Timer',
  FEEDBACK_DISPLAY: 'Feedback Display',
  SHOW_EXACT_PARTIAL: 'Show Exact/Partial',
  HIDE_EXACT_PARTIAL: 'Hide Details',
  AUTO_SUBMIT: 'Auto Submit',
  ENABLE_AUTO_SUBMIT: 'Enable',
  DISABLE_AUTO_SUBMIT: 'Manual',
  TIMER_DURATION: 'Timer Duration (seconds)',
  TIME_UP: "Time's up!",
  CONGRATULATIONS: 'Congratulations! You guessed it!',
};

export const SCORING_RULES = {
  EXACT_MATCH: 1,
  PARTIAL_MATCH: 0.5,
} as const;
