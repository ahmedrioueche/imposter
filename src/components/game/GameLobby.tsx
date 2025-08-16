'use client';

import React, { useState } from 'react';
import { Room, Player } from '@/types/game';
import { Play, LogOut, X, AlertTriangle } from 'lucide-react';

interface GameLobbyProps {
  room: Room;
  currentPlayer: Player;
  onStartGame: () => void;
  onLeaveRoom: () => void;
  loading: boolean;
}

export default function GameLobby({
  room,
  currentPlayer,
  onStartGame,
  onLeaveRoom,
  loading,
}: GameLobbyProps) {
  const [showLeaveConfirmation, setShowLeaveConfirmation] = useState(false);
  const canStartGame = room.players.length >= 3 && currentPlayer.isHost;

  const handleLeaveClick = () => {
    setShowLeaveConfirmation(true);
  };

  const handleConfirmLeave = () => {
    setShowLeaveConfirmation(false);
    onLeaveRoom();
  };

  const handleCancelLeave = () => {
    setShowLeaveConfirmation(false);
  };

  return (
    <div className='space-y-6'>
      {/* Game Rules */}
      <div className='bg-light-card dark:bg-dark-card rounded-lg p-6 border border-light-border dark:border-dark-border'>
        <h3 className='text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-4'>
          How to Play Imposter
        </h3>

        <div className='space-y-3 text-sm text-light-text-secondary dark:text-dark-text-secondary'>
          <div className='flex items-start gap-3'>
            <span className='flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-semibold'>
              1
            </span>
            <p>
              One player is randomly chosen as the <strong>Imposter</strong>
            </p>
          </div>

          <div className='flex items-start gap-3'>
            <span className='flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-semibold'>
              2
            </span>
            <p>
              All players except the Imposter see the same <strong>secret word</strong>
            </p>
          </div>

          <div className='flex items-start gap-3'>
            <span className='flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-semibold'>
              3
            </span>
            <p>The Imposter knows they're the Imposter but doesn't see the word</p>
          </div>

          <div className='flex items-start gap-3'>
            <span className='flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-semibold'>
              4
            </span>
            <p>Discuss and try to figure out who the Imposter is (in real life!)</p>
          </div>

          <div className='flex items-start gap-3'>
            <span className='flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-semibold'>
              5
            </span>
            <p>Everyone votes for who they think is the Imposter</p>
          </div>

          <div className='flex items-start gap-3'>
            <span className='flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-semibold'>
              6
            </span>
            <p>
              <strong>Team wins:</strong> If Imposter gets most votes, correct voters get +1 point
            </p>
          </div>

          <div className='flex items-start gap-3'>
            <span className='flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-semibold'>
              7
            </span>
            <p>
              <strong>Imposter wins:</strong> If someone else gets most votes, Imposter gets +1
              point
            </p>
          </div>
        </div>
      </div>

      {/* Players List */}
      <div className='bg-light-card dark:bg-dark-card rounded-lg p-6 border border-light-border dark:border-dark-border'>
        <h3 className='text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-4'>
          Players Ready ({room.players.length})
        </h3>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
          {room.players.map((player) => (
            <div
              key={player.id}
              className={`flex items-center gap-3 p-3 rounded-lg ${
                player.id === currentPlayer.id
                  ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                  : 'bg-light-background dark:bg-dark-background'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold ${
                  player.isHost ? 'bg-yellow-500' : 'bg-blue-500'
                }`}
              >
                {player.name.charAt(0).toUpperCase()}
              </div>

              <div className='flex-1'>
                <p className='font-medium text-light-text-primary dark:text-dark-text-primary'>
                  {player.name}
                  {player.id === currentPlayer.id && ' (You)'}
                </p>
                <div className='flex items-center gap-2'>
                  {player.isHost && (
                    <span className='text-xs px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full'>
                      Host
                    </span>
                  )}
                  <span className='text-xs text-light-text-secondary dark:text-dark-text-secondary'>
                    Score: {player.score || 0}
                  </span>
                </div>
              </div>

              <div className='w-3 h-3 bg-green-500 rounded-full' title='Ready' />
            </div>
          ))}
        </div>
      </div>

      {/* Game Status */}
      <div className='bg-light-card dark:bg-dark-card rounded-lg p-6 border border-light-border dark:border-dark-border'>
        <div className='flex items-center justify-between'>
          <div>
            <h3 className='text-lg font-semibold text-light-text-primary dark:text-dark-text-primary'>
              Ready to Start?
            </h3>
            <p className='text-sm text-light-text-secondary dark:text-dark-text-secondary'>
              {room.players.length < 3
                ? `Need at least 3 players (${3 - room.players.length} more needed)`
                : `${room.players.length} players ready to play!`}
            </p>
          </div>

          <div className='flex gap-3'>
            <button
              onClick={handleLeaveClick}
              className='flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors'
            >
              Leave
            </button>

            {currentPlayer.isHost && (
              <button
                onClick={onStartGame}
                disabled={!canStartGame || loading}
                className='flex items-center gap-2 px-6 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors'
              >
                {loading ? 'Starting...' : 'Start Game'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Leave Confirmation Modal */}
      {showLeaveConfirmation && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-light-card dark:bg-dark-card rounded-lg p-6 max-w-md w-full border border-light-border dark:border-dark-border'>
            <div className='flex items-center gap-3 mb-4'>
              <AlertTriangle className='text-red-500' size={24} />
              <h3 className='text-lg font-semibold text-light-text-primary dark:text-dark-text-primary'>
                Leave Room?
              </h3>
            </div>

            <p className='text-light-text-secondary dark:text-dark-text-secondary mb-6'>
              Are you sure you want to leave the room? You'll lose your current position and any
              progress in the game.
            </p>

            <div className='flex gap-3 justify-end'>
              <button
                onClick={handleCancelLeave}
                className='px-4 py-2 border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary rounded-lg hover:bg-light-background dark:hover:bg-dark-background transition-colors'
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLeave}
                className='px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors'
              >
                Leave Room
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
