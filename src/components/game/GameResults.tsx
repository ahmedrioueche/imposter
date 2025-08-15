'use client';

import React from 'react';
import { Room, Player } from '@/types/game';
import { Trophy, Target, Users, RotateCcw, Play } from 'lucide-react';

interface GameResultsProps {
  room: Room;
  currentPlayer: Player;
  onNextRound: () => void;
  onResetGame: () => void;
  loading: boolean;
}

export default function GameResults({
  room,
  currentPlayer,
  onNextRound,
  onResetGame,
  loading,
}: GameResultsProps) {
  const lastResult = room.roundResults?.[room.roundResults.length - 1];

  if (!lastResult) {
    return (
      <div className='text-center py-8'>
        <p className='text-light-text-secondary dark:text-dark-text-secondary'>
          No results available
        </p>
      </div>
    );
  }

  const imposterPlayer = room.players.find((p) => p.id === lastResult.imposterPlayerId);
  const voteCounts: Record<string, number> = {};

  // Calculate vote counts
  room.players.forEach((player) => {
    voteCounts[player.id] = 0;
  });

  lastResult.votes.forEach((vote) => {
    if (voteCounts[vote.votedForId] !== undefined) {
      voteCounts[vote.votedForId]++;
    }
  });

  const mostVotedPlayerId = Object.keys(voteCounts).reduce((a, b) =>
    voteCounts[a] > voteCounts[b] ? a : b
  );
  const mostVotedPlayer = room.players.find((p) => p.id === mostVotedPlayerId);
  const maxVotes = Math.max(...Object.values(voteCounts));

  const isImposterCaught = lastResult.outcome === 'team_wins';
  const isImposterWin =
    lastResult.outcome === 'imposter_wins' || lastResult.outcome === 'imposter_wins_by_guess';
  const isImposterWinByGuess = lastResult.outcome === 'imposter_wins_by_guess';
  const isTie = lastResult.outcome === 'tie';
  const didIWin = lastResult.winners.includes(currentPlayer.id);

  return (
    <div className='space-y-6'>
      {/* Results Header */}
      <div className='text-center'>
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${
            isImposterCaught
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
              : isImposterWin
                ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
          }`}
        >
          <Trophy size={16} />
          <span className='font-semibold'>
            {isTie ? 'Tie Game!' : isImposterCaught ? 'Team Wins!' : 'Imposter Wins!'}
          </span>
        </div>

        <h3 className='text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2'>
          Round {lastResult.round} Results
        </h3>

        {isImposterWinByGuess && (
          <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4'>
            <p className='text-red-700 dark:text-red-300 font-semibold'>
              🎯 The imposter guessed the word correctly!
            </p>
          </div>
        )}
      </div>

      {/* Game Outcome */}
      <div className='bg-light-card dark:bg-dark-card rounded-lg p-6 border border-light-border dark:border-dark-border'>
        <div className='text-center space-y-4'>
          {/* Word Reveal */}
          <div className='space-y-2'>
            <p className='text-sm text-light-text-secondary dark:text-dark-text-secondary'>
              The secret word was:
            </p>
            <div className='text-3xl font-bold text-blue-600 dark:text-blue-400'>
              {lastResult.word}
            </div>
          </div>

          {/* Imposter Reveal */}
          <div className='space-y-2'>
            <p className='text-sm text-light-text-secondary dark:text-dark-text-secondary'>
              The imposter was:
            </p>
            <div className='flex items-center justify-center gap-3'>
              <div className='w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg'>
                {imposterPlayer?.name.charAt(0).toUpperCase()}
              </div>
              <div className='text-xl font-bold text-red-600 dark:text-red-400'>
                {imposterPlayer?.name}
                {imposterPlayer?.id === currentPlayer.id && ' (You!)'}
              </div>
            </div>
          </div>

          {/* Voting Results */}
          <div className='space-y-2'>
            <p className='text-sm text-light-text-secondary dark:text-dark-text-secondary'>
              Most voted player:
            </p>
            <div className='flex items-center justify-center gap-3'>
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                  mostVotedPlayer?.id === lastResult.imposterPlayerId
                    ? 'bg-green-500'
                    : 'bg-gray-500'
                }`}
              >
                {mostVotedPlayer?.name.charAt(0).toUpperCase()}
              </div>
              <div className='text-xl font-bold text-light-text-primary dark:text-dark-text-primary'>
                {mostVotedPlayer?.name}
                {mostVotedPlayer?.id === currentPlayer.id && ' (You!)'}
                <span className='text-sm font-normal text-light-text-secondary dark:text-dark-text-secondary ml-2'>
                  ({maxVotes} votes)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Voting Results */}
      <div className='bg-light-card dark:bg-dark-card rounded-lg p-6 border border-light-border dark:border-dark-border'>
        <h4 className='font-semibold text-light-text-primary dark:text-dark-text-primary mb-4'>
          Voting Breakdown
        </h4>

        <div className='space-y-3'>
          {room.players
            .sort((a, b) => (voteCounts[b.id] || 0) - (voteCounts[a.id] || 0))
            .map((player) => (
              <div
                key={player.id}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  player.id === lastResult.imposterPlayerId
                    ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                    : 'bg-light-background dark:bg-dark-background'
                }`}
              >
                <div className='flex items-center gap-3'>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold ${
                      player.id === lastResult.imposterPlayerId
                        ? 'bg-red-500'
                        : player.isHost
                          ? 'bg-yellow-500'
                          : 'bg-blue-500'
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
                      {player.id === lastResult.imposterPlayerId && (
                        <span className='text-xs px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full'>
                          Imposter
                        </span>
                      )}
                      <span className='text-xs text-light-text-secondary dark:text-dark-text-secondary'>
                        Score: {player.score || 0}
                      </span>
                    </div>
                  </div>
                </div>

                <div className='text-right'>
                  <div className='text-lg font-bold text-light-text-primary dark:text-dark-text-primary'>
                    {voteCounts[player.id] || 0}
                  </div>
                  <div className='text-xs text-light-text-secondary dark:text-dark-text-secondary'>
                    votes
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Personal Result */}
      {didIWin && (
        <div className='bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center'>
          <Trophy size={48} className='text-green-500 mx-auto mb-3' />
          <h4 className='text-lg font-bold text-green-700 dark:text-green-300 mb-2'>
            You Won This Round! 🎉
          </h4>
          <p className='text-sm text-green-600 dark:text-green-400'>+1 point added to your score</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className='bg-light-card dark:bg-dark-card rounded-lg p-6 border border-light-border dark:border-dark-border'>
        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <button
            onClick={onNextRound}
            disabled={loading}
            className='flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold'
          >
            <Play size={16} />
            {loading ? 'Starting...' : 'Play Another Round'}
          </button>

          {currentPlayer.isHost && (
            <button
              onClick={onResetGame}
              disabled={loading}
              className='flex items-center justify-center gap-2 px-6 py-3 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold'
            >
              <RotateCcw size={16} />
              {loading ? 'Resetting...' : 'Reset Game'}
            </button>
          )}
        </div>

        <p className='text-xs text-center text-light-text-secondary dark:text-dark-text-secondary mt-4'>
          {currentPlayer.isHost
            ? 'As host, you can start another round or reset the game'
            : 'Waiting for host to start next round...'}
        </p>
      </div>
    </div>
  );
}
