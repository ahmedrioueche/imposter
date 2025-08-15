'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Room, Player } from '@/types/room';
import { roomService } from '@/lib/roomService';
import toast from 'react-hot-toast';

export function useRoomSync() {
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const previousPlayersRef = useRef<Player[]>([]);

  // Load persisted room state on mount
  useEffect(() => {
    const loadPersistedRoom = async () => {
      const savedRoomCode = localStorage.getItem('current-room-code');
      const savedPlayerId = localStorage.getItem('current-player-id');

      if (savedRoomCode && savedPlayerId) {
        try {
          const room = await roomService.getRoom(savedRoomCode);
          const player = room.players.find((p) => p.id === savedPlayerId);

          if (player) {
            setCurrentRoom(room);
            setCurrentPlayer(player);
            setIsConnected(true);
            // Initialize previous players reference on first load
            previousPlayersRef.current = [...room.players];
          } else {
            // Player not found in room, clear storage
            localStorage.removeItem('current-room-code');
            localStorage.removeItem('current-player-id');
          }
        } catch (error) {
          // Room not found, clear storage
          localStorage.removeItem('current-room-code');
          localStorage.removeItem('current-player-id');
          console.error('Failed to load persisted room:', error);
        }
      }
    };

    loadPersistedRoom();
  }, []);

  // Periodic sync to detect changes from server
  useEffect(() => {
    if (currentRoom && currentPlayer) {
      syncIntervalRef.current = setInterval(async () => {
        try {
          const room = await roomService.getRoom(currentRoom.code);
          const player = room.players.find((p) => p.id === currentPlayer.id);

          if (player) {
            // Check for players who left
            const previousPlayers = previousPlayersRef.current;
            if (previousPlayers.length > 0) {
              const leftPlayers = previousPlayers.filter(
                (prevPlayer) => !room.players.find((p) => p.id === prevPlayer.id)
              );

              leftPlayers.forEach((leftPlayer) => {
                if (leftPlayer.id !== currentPlayer.id) {
                  toast.error(`${leftPlayer.name} left the room`, {
                    icon: '👋',
                    duration: 4000,
                  });
                }
              });

              // Players who joined
              const joinedPlayers = room.players.filter(
                (player) => !previousPlayers.find((p) => p.id === player.id)
              );

              joinedPlayers.forEach((joinedPlayer) => {
                if (joinedPlayer.id !== currentPlayer.id) {
                  toast.success(`${joinedPlayer.name} joined the room`, {
                    icon: '🎉',
                    duration: 4000,
                  });
                }
              });
            }

            // Update previous players reference
            previousPlayersRef.current = [...room.players];

            setCurrentRoom(room);
            setCurrentPlayer(player);
            setIsConnected(true);
            setError(null);
          } else {
            // Player was removed
            setCurrentRoom(null);
            setCurrentPlayer(null);
            setIsConnected(false);
            localStorage.removeItem('current-room-code');
            localStorage.removeItem('current-player-id');
          }
        } catch (error) {
          // Room was deleted or connection error
          setIsConnected(false);
          setError('Connection lost');
          console.error('Sync error:', error);
        }
      }, 3000); // Sync every 3 seconds
    }

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, [currentRoom, currentPlayer]);

  // Handle actual tab/window closing - be very careful to avoid false positives
  useEffect(() => {
    let isIntentionalLeave = false;
    let isPageRefreshing = false;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // Detect if this is a page refresh (F5, Ctrl+R, etc.)
      if (event.type === 'beforeunload' && performance.navigation?.type === 1) {
        isPageRefreshing = true;
        return; // Don't leave room on refresh
      }

      // Only trigger if this is NOT an intentional leave and NOT a refresh
      if (currentRoom && currentPlayer && !isIntentionalLeave && !isPageRefreshing) {
        // Use sendBeacon for reliable cleanup on actual page unload
        const data = JSON.stringify({ playerId: currentPlayer.id });
        navigator.sendBeacon(`/api/rooms/${currentRoom.code}/leave`, data);
      }
    };

    const handleVisibilityChange = () => {
      // Reset refresh flag when page becomes visible again
      if (document.visibilityState === 'visible') {
        isPageRefreshing = false;
      }
    };

    // Mark when user intentionally leaves via button
    const markIntentionalLeave = () => {
      isIntentionalLeave = true;
    };

    if (currentRoom && currentPlayer) {
      window.addEventListener('beforeunload', handleBeforeUnload);
      document.addEventListener('visibilitychange', handleVisibilityChange);

      // Store the function reference so we can call it from leaveRoom
      (window as any).__markIntentionalLeave = markIntentionalLeave;
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      delete (window as any).__markIntentionalLeave;
    };
  }, [currentRoom, currentPlayer]);

  const createRoom = useCallback(async (playerName: string, roomName?: string) => {
    try {
      setError(null);
      const { room, player } = await roomService.createRoom(playerName, roomName);

      setCurrentRoom(room);
      setCurrentPlayer(player);
      setIsConnected(true);

      // Initialize previous players reference
      previousPlayersRef.current = [...room.players];

      // Persist to localStorage
      localStorage.setItem('current-room-code', room.code);
      localStorage.setItem('current-player-id', player.id);

      // Show success toast
      toast.success(`Room created! Code: ${room.code}`, {
        icon: '🎉',
        duration: 5000,
      });

      return room;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create room');
      throw error;
    }
  }, []);

  const joinRoom = useCallback(async (roomCode: string, playerName: string) => {
    try {
      setError(null);
      const { room, player } = await roomService.joinRoom(roomCode, playerName);

      setCurrentRoom(room);
      setCurrentPlayer(player);
      setIsConnected(true);

      // Initialize previous players reference
      previousPlayersRef.current = [...room.players];

      // Persist to localStorage
      localStorage.setItem('current-room-code', room.code);
      localStorage.setItem('current-player-id', player.id);

      // Show success toast
      toast.success(`Joined ${room.name}!`, {
        icon: '✅',
        duration: 4000,
      });

      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to join room');
      return false;
    }
  }, []);

  const leaveRoom = useCallback(async () => {
    // Mark as intentional leave to prevent beforeunload handler
    if ((window as any).__markIntentionalLeave) {
      (window as any).__markIntentionalLeave();
    }

    if (currentRoom && currentPlayer) {
      try {
        await roomService.leaveRoom(currentRoom.code, currentPlayer.id);
      } catch (error) {
        console.error('Error leaving room:', error);
      }
    }

    setCurrentRoom(null);
    setCurrentPlayer(null);
    setIsConnected(false);
    setError(null);

    // Clear previous players reference
    previousPlayersRef.current = [];

    // Clear localStorage
    localStorage.removeItem('current-room-code');
    localStorage.removeItem('current-player-id');
  }, [currentRoom, currentPlayer]);

  return {
    currentRoom,
    currentPlayer,
    isConnected,
    error,
    createRoom,
    joinRoom,
    leaveRoom,
  };
}
