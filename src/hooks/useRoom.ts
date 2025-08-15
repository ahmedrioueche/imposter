'use client';

import { useRoomSync } from './useRoomSync';

export function useRoom() {
  const { currentRoom, currentPlayer, isConnected, createRoom, joinRoom, leaveRoom } =
    useRoomSync();

  const roomState = {
    currentRoom,
    currentPlayer,
    isConnected,
  };

  return {
    roomState,
    createRoom,
    joinRoom,
    leaveRoom,
  };
}
