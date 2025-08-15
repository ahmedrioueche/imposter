// GamePlayer and GameRoom types removed - using base Room and Player types with optional game fields

export interface Vote {
  voterId: string;
  votedForId: string;
}

export interface RoundResult {
  round: number;
  word: string;
  firstWord?: string;
  imposterPlayerId: string;
  votes: Vote[];
  outcome: 'imposter_wins' | 'team_wins' | 'tie' | 'imposter_wins_by_guess';
  winners: string[]; // Player IDs who get points
}

export type GameState =
  | 'waiting' // Waiting for players
  | 'starting' // Game is starting
  | 'word_reveal' // Showing word to players
  | 'discussion' // Players discuss (timer optional)
  | 'voting' // Players vote for imposter
  | 'results' // Show round results
  | 'game_over'; // Game finished

export interface Player {
  id: string;
  name: string;
  isHost: boolean;
  joinedAt: Date;
  score?: number;
  isImposter?: boolean;
  hasVoted?: boolean;
  votedFor?: string;
  hasGuessedWord?: boolean;
  wordGuess?: string;
}

export interface Room {
  id: string;
  code: string;
  name: string;
  players: Player[];
  maxPlayers: number;
  createdAt: Date;
  isActive: boolean;
  gameState?: GameState;
  currentRound?: number;
  word?: string;
  firstWord?: string;
  imposterPlayerId?: string;
  firstPlayerId?: string;
  imposterGuessedCorrectly?: boolean;
  votes?: Vote[];
  roundResults?: RoundResult[];
}
