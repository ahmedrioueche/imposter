'use client';

import React, { useState } from 'react';
import { Users, Copy, LogOut, Play } from 'lucide-react';
import { Room, Player } from '@/types/room';
import ConnectionStatus from './ConnectionStatus';

interface RoomLobbyProps {
  room: Room;
  currentPlayer: Player;
  isConnected: boolean;
  onLeaveRoom: () => void;
  onStartGame?: () => void;
}

export default function RoomLobby({
  room,
  currentPlayer,
  isConnected,
  onLeaveRoom,
  onStartGame,
}: RoomLobbyProps) {
  const [copied, setCopied] = useState(false);

  const copyRoomCode = async () => {
    try {
      await navigator.clipboard.writeText(room.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy room code:', err);
    }
  };

  return (
    <div className='max-w-2xl mx-auto space-y-6'>
      {/* Room Header */}
      <div className='bg-light-card dark:bg-dark-card rounded-lg p-6 border border-light-border dark:border-dark-border'>
        <div className='flex items-center justify-between mb-4'>
          <div>
            <h2 className='text-2xl font-bold text-light-text-primary dark:text-dark-text-primary'>
              {room.name}
            </h2>
            <p className='text-light-text-secondary dark:text-dark-text-secondary'>
              Room Code: {room.code}
            </p>
          </div>
          <button
            onClick={copyRoomCode}
            className='flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors'
          >
            <Copy size={16} />
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
        </div>

        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2 text-light-text-secondary dark:text-dark-text-secondary'>
            <Users size={16} />
            <span>
              {room.players.length}/{room.maxPlayers} players
            </span>
          </div>
          <ConnectionStatus isConnected={isConnected} />
        </div>
      </div>

      {/* Players List */}
      <div className='bg-light-card dark:bg-dark-card rounded-lg p-6 border border-light-border dark:border-dark-border'>
        <h3 className='text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-4'>
          Players in Room
        </h3>

        <div className='space-y-3'>
          {room.players.map((player) => (
            <div
              key={player.id}
              className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                player.id === currentPlayer.id
                  ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                  : 'bg-light-background dark:bg-dark-background'
              }`}
            >
              <div className='flex items-center gap-3'>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold ${
                    player.isHost ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}
                >
                  {player.name.charAt(0).toUpperCase()}
                </div>
                <div>
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
                      Joined {player.joinedAt.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className='flex items-center gap-2'>
                <div className='w-3 h-3 bg-green-500 rounded-full animate-pulse' title='Online' />
                <span className='text-xs text-green-600 dark:text-green-400'>Online</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className='flex gap-4'>
        <button
          onClick={onLeaveRoom}
          className='flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors'
        >
          <LogOut size={16} />
          Leave Room
        </button>

        {currentPlayer.isHost && onStartGame && (
          <button
            onClick={onStartGame}
            className='flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors ml-auto'
          >
            <Play size={16} />
            Start Game
          </button>
        )}
      </div>
    </div>
  );
}
