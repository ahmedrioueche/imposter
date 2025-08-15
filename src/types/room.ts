export interface Player {
  id: string;
  name: string;
  isHost: boolean;
  joinedAt: Date;
  score?: number;
  isImposter?: boolean;
  hasVoted?: boolean;
  votedFor?: string;
}

export interface Room {
  id: string;
  code: string;
  name: string;
  players: Player[];
  maxPlayers: number;
  createdAt: Date;
  isActive: boolean;
  gameState?:
    | 'waiting'
    | 'starting'
    | 'word_reveal'
    | 'discussion'
    | 'voting'
    | 'results'
    | 'game_over';
  currentRound?: number;
  word?: string;
  imposterPlayerId?: string;
  votes?: Array<{ voterId: string; votedForId: string }>;
  roundResults?: Array<{
    round: number;
    word: string;
    imposterPlayerId: string;
    votes: Array<{ voterId: string; votedForId: string }>;
    outcome: 'imposter_wins' | 'team_wins' | 'tie';
    winners: string[];
  }>;
}

export interface RoomState {
  currentRoom: Room | null;
  currentPlayer: Player | null;
  isConnected: boolean;
}
