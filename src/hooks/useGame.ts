'use client';

import { useState, useEffect, useCallback } from 'react';
import { Room, Player, GameState } from '@/types/game';
import { GameService } from '@/lib/gameService';
import toast from 'react-hot-toast';

export function useGame(roomCode: string | null) {
  const [gameRoom, setGameRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const gameService = new GameService();

  // Fetch game state
  const fetchGameState = useCallback(async () => {
    if (!roomCode) return;

    try {
      const room = await gameService.getGameState(roomCode);
      setGameRoom(room);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch game state');
      console.error('Error fetching game state:', error);
    }
  }, [roomCode]);

  // Start game
  const startGame = useCallback(async () => {
    if (!roomCode) return;

    setLoading(true);
    try {
      const room = await gameService.startGame(roomCode);
      setGameRoom(room);
      setError(null);
      toast.success('Game started!', { icon: '🎮' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to start game';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [roomCode]);

  // Submit vote
  const submitVote = useCallback(
    async (voterId: string, votedForId: string) => {
      if (!roomCode) return;

      setLoading(true);
      try {
        const room = await gameService.submitVote(roomCode, voterId, votedForId);
        setGameRoom(room);
        setError(null);
        toast.success('Vote submitted!', { icon: '🗳️' });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to submit vote';
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    },
    [roomCode]
  );

  // Next round
  const nextRound = useCallback(async () => {
    if (!roomCode) return;

    setLoading(true);
    try {
      const room = await gameService.nextRound(roomCode);
      setGameRoom(room);
      setError(null);
      toast.success('Starting next round!', { icon: '🔄' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to start next round';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [roomCode]);

  // Reset game
  const resetGame = useCallback(async () => {
    if (!roomCode) return;

    setLoading(true);
    try {
      const room = await gameService.resetGame(roomCode);
      setGameRoom(room);
      setError(null);
      toast.success('Game reset!', { icon: '🔄' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to reset game';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [roomCode]);

  // Start voting phase
  const startVoting = useCallback(async () => {
    if (!roomCode) return;

    setLoading(true);
    try {
      const room = await gameService.startVoting(roomCode);
      setGameRoom(room);
      setError(null);
      toast.success('Voting started!', { icon: '🗳️' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to start voting';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [roomCode]);

  // Auto-fetch game state periodically
  useEffect(() => {
    if (!roomCode) return;

    fetchGameState();

    const interval = setInterval(fetchGameState, 2000); // Poll every 2 seconds

    return () => clearInterval(interval);
  }, [roomCode, fetchGameState]);

  // Declare imposter victory
  const declareImposterVictory = useCallback(
    async (hostId: string) => {
      if (!roomCode) return;

      setLoading(true);
      try {
        const room = await gameService.declareImposterVictory(roomCode, hostId);
        setGameRoom(room);
        setError(null);
        toast.success('Imposter wins by guessing the word!', { icon: '🎯' });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to declare imposter victory';
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    },
    [roomCode]
  );

  return {
    gameRoom,
    loading,
    error,
    startGame,
    submitVote,
    nextRound,
    resetGame,
    startVoting,
    declareImposterVictory,
    fetchGameState,
  };
}
