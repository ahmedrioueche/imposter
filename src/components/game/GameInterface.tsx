'use client';

import React from 'react';
import { useGame } from '@/hooks/useGame';
import { Users, Trophy, Clock } from 'lucide-react';
import { Room, Player } from '@/types/game';
import GameLobby from './GameLobby';
import GameResults from './GameResults';
import VotingPhase from './VotingPhase';
import WordReveal from './WordReveal';
import { WordGenerator } from '@/lib/wordGenerator';

interface GameInterfaceProps {
  room: Room;
  currentPlayer: Player;
  onLeaveRoom: () => void;
}

export default function GameInterface({ room, currentPlayer, onLeaveRoom }: GameInterfaceProps) {
  const {
    gameRoom,
    loading,
    startGame,
    submitVote,
    nextRound,
    resetGame,
    startVoting,
    declareImposterVictory,
  } = useGame(room.code);

  // Use the latest game state from the hook, fallback to props
  const currentGameRoom = gameRoom || room;
  const currentGamePlayer =
    currentGameRoom.players.find((p: { id: string }) => p.id === currentPlayer.id) || currentPlayer;
  const renderGamePhase = () => {
    switch (currentGameRoom.gameState) {
      case 'waiting':
        return (
          <GameLobby
            room={currentGameRoom}
            currentPlayer={currentGamePlayer}
            onStartGame={startGame}
            onLeaveRoom={onLeaveRoom}
            loading={loading}
          />
        );

      case 'word_reveal':
        return (
          <WordReveal
            room={currentGameRoom}
            currentPlayer={currentGamePlayer}
            onContinue={startVoting}
            onGetNewWord={nextRound}
            onDeclareImposterVictory={declareImposterVictory}
            loading={loading}
            onLeaveRoom={onLeaveRoom}
          />
        );

      case 'voting':
        return (
          <VotingPhase
            room={currentGameRoom}
            currentPlayer={currentGamePlayer}
            onSubmitVote={submitVote}
            loading={loading}
          />
        );

      case 'results':
        return (
          <GameResults
            room={currentGameRoom}
            currentPlayer={currentGamePlayer}
            onNextRound={nextRound}
            onResetGame={resetGame}
            loading={loading}
          />
        );

      default:
        return (
          <div className='text-center py-8'>
            <p className='text-light-text-secondary dark:text-dark-text-secondary'>
              Game state: {currentGameRoom.gameState}
            </p>
          </div>
        );
    }
  };

  return (
    <div className='w-full max-w-4xl mx-auto px-3 sm:px-4 space-y-4 sm:space-y-6'>
      {/* Game Header */}
      <div className='bg-light-card dark:bg-dark-card rounded-lg p-4 sm:p-6 border border-light-border dark:border-dark-border'>
        {/* Header Info - Stack on mobile */}
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4'>
          <div className='min-w-0 flex-1'>
            <h2 className='text-xl sm:text-2xl font-bold text-light-text-primary dark:text-dark-text-primary truncate'>
              Imposter Game
            </h2>
            <p className='text-sm sm:text-base text-light-text-secondary dark:text-dark-text-secondary truncate'>
              Room: {currentGameRoom.name} ({currentGameRoom.code})
            </p>
          </div>

          {/* Stats - Horizontal on mobile, keep together */}
          <div className='flex items-center gap-3 sm:gap-4 flex-shrink-0'>
            <div className='flex items-center gap-1 sm:gap-2 text-light-text-secondary dark:text-dark-text-secondary'>
              <Users size={14} className='sm:w-4 sm:h-4' />
              <span className='text-sm sm:text-base'>{currentGameRoom.players.length} players</span>
            </div>

            {currentGameRoom.currentRound && currentGameRoom.currentRound > 0 && (
              <div className='flex items-center gap-1 sm:gap-2 text-light-text-secondary dark:text-dark-text-secondary'>
                <Clock size={14} className='sm:w-4 sm:h-4' />
                <span className='text-sm sm:text-base'>Round {currentGameRoom.currentRound}</span>
              </div>
            )}
          </div>
        </div>

        {/* Player Scores - Responsive grid */}
        {currentGameRoom.gameState !== 'waiting' && (
          <div className='grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3'>
            {currentGameRoom.players.map((player) => (
              <div
                key={player.id}
                className={`flex items-center gap-2 px-2 sm:px-3 py-2 rounded-lg min-w-0 ${
                  player.id === currentPlayer.id
                    ? 'bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800'
                    : 'bg-light-background dark:bg-dark-background'
                }`}
              >
                <div
                  className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0 ${
                    player.isHost ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}
                >
                  {player?.name?.charAt(0).toUpperCase()}
                </div>
                <div className='min-w-0 flex-1'>
                  <span className='text-xs sm:text-sm font-medium text-light-text-primary dark:text-dark-text-primary block truncate'>
                    {player.name}
                    {player.id === currentPlayer.id && ' (You)'}
                  </span>
                  <div className='flex items-center gap-1'>
                    <Trophy size={10} className='sm:w-3 sm:h-3 text-yellow-500 flex-shrink-0' />
                    <span className='text-xs font-semibold text-light-text-secondary dark:text-dark-text-secondary'>
                      {player.score || 0}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Game Phase Content */}
      <div className='w-full'>{renderGamePhase()}</div>
    </div>
  );
}
