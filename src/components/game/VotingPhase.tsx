'use client';

import React, { useState } from 'react';
import { Vote, CheckCircle, Clock } from 'lucide-react';
import { Room, Player } from '@/types/game';

interface VotingPhaseProps {
  room: Room;
  currentPlayer: Player;
  onSubmitVote: (voterId: string, votedForId: string) => void;
  loading: boolean;
}

export default function VotingPhase({
  room,
  currentPlayer,
  onSubmitVote,
  loading,
}: VotingPhaseProps) {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(
    currentPlayer.votedFor || null
  );

  const hasVoted = currentPlayer.hasVoted;
  const votedPlayersCount = room.players.filter((p) => p.hasVoted).length;
  const totalPlayers = room.players.length;

  const handleVoteSubmit = () => {
    if (selectedPlayerId && !loading) {
      onSubmitVote(currentPlayer.id, selectedPlayerId);
    }
  };

  const canVote = selectedPlayerId && !loading;

  return (
    <div className='space-y-6'>
      {/* Voting Header */}
      <div className='text-center'>
        <div className='inline-flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full mb-4'>
          <Vote size={16} />
          <span className='font-semibold'>Voting Phase</span>
        </div>

        <h3 className='text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2'>
          Who is the Imposter?
        </h3>

        <p className='text-light-text-secondary dark:text-dark-text-secondary'>
          Vote for the player you think is the imposter
        </p>
      </div>

      {/* Voting Progress */}
      <div className='bg-light-card dark:bg-dark-card rounded-lg p-4 border border-light-border dark:border-dark-border'>
        <div className='flex items-center justify-between mb-2'>
          <span className='text-sm font-medium text-light-text-primary dark:text-dark-text-primary'>
            Voting Progress
          </span>
          <span className='text-sm text-light-text-secondary dark:text-dark-text-secondary'>
            {votedPlayersCount}/{totalPlayers} voted
          </span>
        </div>

        <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
          <div
            className='bg-blue-500 h-2 rounded-full transition-all duration-300'
            style={{ width: `${(votedPlayersCount / totalPlayers) * 100}%` }}
          />
        </div>

        {votedPlayersCount === totalPlayers && (
          <p className='text-sm text-green-600 dark:text-green-400 mt-2 font-medium'>
            All votes submitted! Calculating results...
          </p>
        )}
      </div>

      {/* Player Selection */}
      <div className='bg-light-card dark:bg-dark-card rounded-lg p-6 border border-light-border dark:border-dark-border'>
        <h4 className='font-semibold text-light-text-primary dark:text-dark-text-primary mb-4'>
          Select a player to vote for:
        </h4>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
          {room.players
            .filter((player) => player.id !== currentPlayer.id) // Can't vote for yourself
            .map((player) => (
              <button
                key={player.id}
                onClick={() => !hasVoted && setSelectedPlayerId(player.id)}
                disabled={hasVoted || loading}
                className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                  selectedPlayerId === player.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-light-border dark:border-dark-border hover:border-blue-300 dark:hover:border-blue-700'
                } ${
                  hasVoted || loading
                    ? 'opacity-50 cursor-not-allowed'
                    : 'cursor-pointer hover:bg-light-background dark:hover:bg-dark-background'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                    player.isHost ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}
                >
                  {player.name.charAt(0).toUpperCase()}
                </div>

                <div className='flex-1 text-left'>
                  <p className='font-medium text-light-text-primary dark:text-dark-text-primary'>
                    {player.name}
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
                    {player.hasVoted && <CheckCircle size={12} className='text-green-500' />}
                  </div>
                </div>

                {selectedPlayerId === player.id && (
                  <div className='w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center'>
                    <CheckCircle size={16} className='text-white' />
                  </div>
                )}
              </button>
            ))}
        </div>
      </div>

      {/* Vote Submission */}
      <div className='bg-light-card dark:bg-dark-card rounded-lg p-6 border border-light-border dark:border-dark-border'>
        {hasVoted ? (
          <div className='text-center space-y-3'>
            <CheckCircle size={48} className='text-green-500 mx-auto' />
            <h4 className='font-semibold text-green-600 dark:text-green-400'>Vote Submitted!</h4>
            <p className='text-sm text-light-text-secondary dark:text-dark-text-secondary'>
              You voted for:{' '}
              <strong>{room.players.find((p) => p.id === currentPlayer.votedFor)?.name}</strong>
            </p>
            <p className='text-xs text-light-text-secondary dark:text-dark-text-secondary'>
              Waiting for other players to vote...
            </p>
          </div>
        ) : (
          <div className='text-center space-y-4'>
            <h4 className='font-semibold text-light-text-primary dark:text-dark-text-primary'>
              Ready to submit your vote?
            </h4>

            {selectedPlayerId ? (
              <p className='text-sm text-light-text-secondary dark:text-dark-text-secondary'>
                You are voting for:{' '}
                <strong>{room.players.find((p) => p.id === selectedPlayerId)?.name}</strong>
              </p>
            ) : (
              <p className='text-sm text-light-text-secondary dark:text-dark-text-secondary'>
                Select a player above to vote
              </p>
            )}

            <button
              onClick={handleVoteSubmit}
              disabled={!canVote}
              className='px-6 py-3 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold'
            >
              {loading ? 'Submitting...' : 'Submit Vote'}
            </button>
          </div>
        )}
      </div>

      {/* Players Status */}
      <div className='bg-light-card dark:bg-dark-card rounded-lg p-6 border border-light-border dark:border-dark-border'>
        <h4 className='font-semibold text-light-text-primary dark:text-dark-text-primary mb-4'>
          Voting Status
        </h4>

        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3'>
          {room.players.map((player) => (
            <div
              key={player.id}
              className={`flex items-center gap-2 p-2 rounded-lg ${
                player.id === currentPlayer.id
                  ? 'bg-blue-50 dark:bg-blue-900/20'
                  : 'bg-light-background dark:bg-dark-background'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold text-white ${
                  player.isHost ? 'bg-yellow-500' : 'bg-blue-500'
                }`}
              >
                {player.name.charAt(0).toUpperCase()}
              </div>

              <span className='text-xs font-medium text-light-text-primary dark:text-dark-text-primary flex-1'>
                {player.name}
                {player.id === currentPlayer.id && ' (You)'}
              </span>

              {player.hasVoted ? (
                <CheckCircle size={14} className='text-green-500' />
              ) : (
                <Clock size={14} className='text-gray-400' />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
