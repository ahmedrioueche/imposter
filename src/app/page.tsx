'use client';

import React from 'react';
import { useRoom } from '@/hooks/useRoom';
import { useTheme } from '@/hooks/useTheme';
import RoomSetup from '@/components/room/RoomSetup';
import RoomLobby from '@/components/room/RoomLobby';
import GameInterface from '@/components/game/GameInterface';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { Toaster } from 'react-hot-toast';

export default function Page() {
  const { roomState, createRoom, joinRoom, leaveRoom } = useRoom();
  const { theme, toggleTheme } = useTheme();

  const handleStartGame = async () => {
    if (!roomState.currentRoom) return;

    try {
      const gameService = new (await import('@/lib/gameService')).GameService();
      await gameService.startGame(roomState.currentRoom.code);
      // The room state will be updated via the sync mechanism
    } catch (error) {
      console.error('Failed to start game:', error);
    }
  };

  return (
    <div className='min-h-screen bg-light-background dark:bg-dark-background transition-colors'>
      {/* Header */}
      <header className='border-b border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card'>
        <div className='max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between'>
          <h1 className='font-dancing text-xl sm:text-2xl font-bold text-light-text-primary dark:text-dark-text-primary truncate'>
            Multiplayer Game
          </h1>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>
      </header>

      {/* Main Content */}
      <main className='w-full max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8'>
        {!roomState.currentRoom ? (
          <RoomSetup onCreateRoom={createRoom} onJoinRoom={joinRoom} />
        ) : // Check if room has game state to show GameInterface or RoomLobby
        roomState.currentRoom.gameState && roomState.currentRoom.gameState !== 'waiting' ? (
          <GameInterface
            room={roomState.currentRoom}
            currentPlayer={roomState.currentPlayer!}
            onLeaveRoom={leaveRoom}
          />
        ) : (
          <RoomLobby
            room={roomState.currentRoom}
            currentPlayer={roomState.currentPlayer!}
            isConnected={roomState.isConnected}
            onLeaveRoom={leaveRoom}
            onStartGame={handleStartGame}
          />
        )}
      </main>

      {/* Footer */}
      <footer className='border-t border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card mt-8 sm:mt-12'>
        <div className='max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 text-center'>
          <p className='text-light-text-secondary dark:text-dark-text-secondary text-xs sm:text-sm'>
            Create or join a room to play with friends!
          </p>
        </div>
      </footer>

      {/* Toast Notifications */}
      <Toaster
        position='top-right'
        toastOptions={{
          duration: 4000,
          style: {
            background: theme === 'dark' ? '#1f2937' : '#ffffff',
            color: theme === 'dark' ? '#f9fafb' : '#111827',
            border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow:
              theme === 'dark'
                ? '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)'
                : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
          success: {
            style: {
              background: theme === 'dark' ? '#065f46' : '#ecfdf5',
              color: theme === 'dark' ? '#d1fae5' : '#065f46',
              border: `1px solid ${theme === 'dark' ? '#059669' : '#a7f3d0'}`,
            },
          },
          error: {
            style: {
              background: theme === 'dark' ? '#7f1d1d' : '#fef2f2',
              color: theme === 'dark' ? '#fecaca' : '#7f1d1d',
              border: `1px solid ${theme === 'dark' ? '#dc2626' : '#fca5a5'}`,
            },
          },
        }}
      />
    </div>
  );
}
