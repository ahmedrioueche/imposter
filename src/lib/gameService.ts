import { Room, Player, Vote, RoundResult, GameState } from '@/types/game';
import { WordGenerator } from './wordGenerator';

export class GameService {
  private baseUrl = '/api/game';

  // Start a new game
  async startGame(roomCode: string): Promise<Room> {
    const response = await fetch(`${this.baseUrl}/${roomCode}/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to start game');
    }

    return await response.json();
  }

  // Get current game state
  async getGameState(roomCode: string): Promise<Room> {
    const response = await fetch(`${this.baseUrl}/${roomCode}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get game state');
    }

    return await response.json();
  }

  // Submit a vote
  async submitVote(roomCode: string, voterId: string, votedForId: string): Promise<Room> {
    const response = await fetch(`${this.baseUrl}/${roomCode}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ voterId, votedForId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to submit vote');
    }

    return await response.json();
  }

  // Start next round
  async nextRound(roomCode: string): Promise<Room> {
    const response = await fetch(`${this.baseUrl}/${roomCode}/next-round`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to start next round');
    }

    return await response.json();
  }

  // Reset game
  async resetGame(roomCode: string): Promise<Room> {
    const response = await fetch(`${this.baseUrl}/${roomCode}/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to reset game');
    }

    return await response.json();
  }

  // Start voting phase
  async startVoting(roomCode: string): Promise<Room> {
    const response = await fetch(`${this.baseUrl}/${roomCode}/start-voting`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to start voting');
    }

    return await response.json();
  }

  // Declare imposter victory (host only)
  async declareImposterVictory(roomCode: string, hostId: string): Promise<Room> {
    const response = await fetch(`${this.baseUrl}/${roomCode}/imposter-win`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hostId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to declare imposter victory');
    }

    return await response.json();
  }

  // Submit imposter word guess
  async submitWordGuess(roomCode: string, playerId: string, guess: string): Promise<Room> {
    const response = await fetch(`${this.baseUrl}/${roomCode}/guess-word`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId, guess }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to submit word guess');
    }

    return await response.json();
  }

  // Host declares imposter guessed correctly
  async declareImposterWin(roomCode: string, hostId: string): Promise<Room> {
    const response = await fetch(`${this.baseUrl}/${roomCode}/imposter-win`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hostId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to declare imposter win');
    }

    return await response.json();
  }

  // Client-side game logic helpers
  static selectRandomImposter(players: Player[]): string {
    const eligiblePlayers = players.filter((p) => p && p.id);
    if (eligiblePlayers.length === 0) {
      throw new Error('No eligible players found for imposter selection');
    }
    const randomIndex = Math.floor(Math.random() * eligiblePlayers.length);
    return eligiblePlayers[randomIndex].id;
  }

  static async generateGameWord(): Promise<{ word: string; firstWord: string }> {
    return await WordGenerator.generateWord();
  }

  static selectFirstPlayer(players: Player[]): string {
    const eligiblePlayers = players.filter((p) => p && p.id);
    if (eligiblePlayers.length === 0) {
      throw new Error('No eligible players found for first player selection');
    }
    const randomIndex = Math.floor(Math.random() * eligiblePlayers.length);
    return eligiblePlayers[randomIndex].id;
  }

  static calculateVoteResults(
    votes: Vote[],
    players: Player[]
  ): {
    voteCounts: Record<string, number>;
    mostVoted: string[];
    isTie: boolean;
  } {
    const voteCounts: Record<string, number> = {};

    // Initialize vote counts
    players.forEach((player) => {
      voteCounts[player.id] = 0;
    });

    // Count votes
    votes.forEach((vote) => {
      if (voteCounts[vote.votedForId] !== undefined) {
        voteCounts[vote.votedForId]++;
      }
    });

    // Find highest vote count
    const maxVotes = Math.max(...Object.values(voteCounts));
    const mostVoted = Object.keys(voteCounts).filter(
      (playerId) => voteCounts[playerId] === maxVotes
    );

    const isTie = mostVoted.length > 1;

    return { voteCounts, mostVoted, isTie };
  }

  static determineRoundOutcome(
    mostVoted: string[],
    imposterPlayerId: string,
    isTie: boolean
  ): 'imposter_wins' | 'team_wins' | 'tie' {
    if (isTie) {
      return 'tie';
    }

    const accusedPlayerId = mostVoted[0];
    if (accusedPlayerId === imposterPlayerId) {
      return 'team_wins';
    } else {
      return 'imposter_wins';
    }
  }

  static calculateScoreUpdates(
    outcome: 'imposter_wins' | 'team_wins' | 'tie',
    votes: Vote[],
    imposterPlayerId: string,
    mostVoted: string[]
  ): string[] {
    const winners: string[] = [];

    if (outcome === 'imposter_wins') {
      // Imposter wins, only imposter gets point
      winners.push(imposterPlayerId);
    } else if (outcome === 'team_wins') {
      // Team wins, players who voted for the imposter get points
      const correctVoters = votes
        .filter((vote) => vote.votedForId === imposterPlayerId)
        .map((vote) => vote.voterId);
      winners.push(...correctVoters);
    }
    // If tie, no one gets points

    return winners;
  }
}
