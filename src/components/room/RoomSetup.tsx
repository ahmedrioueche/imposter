'use client';

import React, { useState } from 'react';
import { Users, Plus, Hash } from 'lucide-react';

interface RoomSetupProps {
  onCreateRoom: (playerName: string, roomName?: string) => Promise<any>;
  onJoinRoom: (roomCode: string, playerName: string) => Promise<boolean>;
}

export default function RoomSetup({ onCreateRoom, onJoinRoom }: RoomSetupProps) {
  const [mode, setMode] = useState<'menu' | 'create' | 'join'>('menu');
  const [playerName, setPlayerName] = useState('');
  const [roomName, setRoomName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!playerName.trim()) {
      setError('Please enter your name');
      setLoading(false);
      return;
    }

    try {
      await onCreateRoom(playerName.trim(), roomName.trim() || undefined);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create room');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!playerName.trim()) {
      setError('Please enter your name');
      setLoading(false);
      return;
    }

    if (!roomCode.trim() || roomCode.length !== 6) {
      setError('Please enter a valid 6-digit room code');
      setLoading(false);
      return;
    }

    try {
      const success = await onJoinRoom(roomCode.trim(), playerName.trim());
      if (!success) {
        setError('Room not found, is full, or name already taken');
      }
    } catch (error) {
      setError('Failed to join room. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setPlayerName('');
    setRoomName('');
    setRoomCode('');
    setError('');
  };

  if (mode === 'menu') {
    return (
      <div className='max-w-md mx-auto space-y-6'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2'>
            Multiplayer Game
          </h1>
          <p className='text-light-text-secondary dark:text-dark-text-secondary'>
            Create or join a room to play with friends
          </p>
        </div>

        <div className='space-y-4'>
          <button
            onClick={() => setMode('create')}
            className='w-full flex items-center justify-center gap-3 p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors'
          >
            <Plus size={20} />
            <span className='font-semibold'>Create Room</span>
          </button>

          <button
            onClick={() => setMode('join')}
            className='w-full flex items-center justify-center gap-3 p-4 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors'
          >
            <Hash size={20} />
            <span className='font-semibold'>Join Room</span>
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'create') {
    return (
      <div className='max-w-md mx-auto'>
        <div className='bg-light-card dark:bg-dark-card rounded-lg p-6 border border-light-border dark:border-dark-border'>
          <div className='flex items-center gap-2 mb-6'>
            <Plus className='text-blue-500' size={24} />
            <h2 className='text-xl font-bold text-light-text-primary dark:text-dark-text-primary'>
              Create Room
            </h2>
          </div>

          <form onSubmit={handleCreateRoom} className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2'>
                Your Name *
              </label>
              <input
                type='text'
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className='w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-background dark:bg-dark-background text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='Enter your name'
                maxLength={20}
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2'>
                Room Name (Optional)
              </label>
              <input
                type='text'
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className='w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-background dark:bg-dark-background text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='Enter room name'
                maxLength={30}
              />
            </div>

            {error && <p className='text-red-500 text-sm'>{error}</p>}

            <div className='flex gap-3 pt-4'>
              <button
                type='button'
                onClick={() => {
                  setMode('menu');
                  resetForm();
                }}
                className='flex-1 px-4 py-2 border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary rounded-lg hover:bg-light-background dark:hover:bg-dark-background transition-colors'
              >
                Back
              </button>
              <button
                type='submit'
                disabled={loading}
                className='flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors'
              >
                {loading ? 'Creating...' : 'Create Room'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (mode === 'join') {
    return (
      <div className='max-w-md mx-auto'>
        <div className='bg-light-card dark:bg-dark-card rounded-lg p-6 border border-light-border dark:border-dark-border'>
          <div className='flex items-center gap-2 mb-6'>
            <Hash className='text-green-500' size={24} />
            <h2 className='text-xl font-bold text-light-text-primary dark:text-dark-text-primary'>
              Join Room
            </h2>
          </div>

          <form onSubmit={handleJoinRoom} className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2'>
                Your Name *
              </label>
              <input
                type='text'
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className='w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-background dark:bg-dark-background text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-green-500'
                placeholder='Enter your name'
                maxLength={20}
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2'>
                Room Code *
              </label>
              <input
                type='text'
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className='w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-background dark:bg-dark-background text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-green-500 text-center text-lg font-mono'
                placeholder='000000'
                maxLength={6}
              />
              <p className='text-xs text-light-text-secondary dark:text-dark-text-secondary mt-1'>
                Enter the 6-digit room code
              </p>
            </div>

            {error && <p className='text-red-500 text-sm'>{error}</p>}

            <div className='flex gap-3 pt-4'>
              <button
                type='button'
                onClick={() => {
                  setMode('menu');
                  resetForm();
                }}
                className='flex-1 px-4 py-2 border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary rounded-lg hover:bg-light-background dark:hover:bg-dark-background transition-colors'
              >
                Back
              </button>
              <button
                type='submit'
                disabled={loading}
                className='flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors'
              >
                {loading ? 'Joining...' : 'Join Room'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return null;
}
