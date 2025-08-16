'use client';

import React, { useState, useEffect } from 'react';
import { Room, Player } from '@/types/game';
import { Eye, EyeOff, MessageCircle, LogOut, AlertTriangle } from 'lucide-react';

interface WordRevealProps {
  room: Room;
  currentPlayer: Player;
  onContinue: () => void;
  onGetNewWord: () => void;
  onDeclareImposterVictory: (hostId: string) => void;
  onLeaveRoom: () => void;
  loading: boolean;
}

export default function WordReveal({
  room,
  currentPlayer,
  onContinue,
  onGetNewWord,
  onLeaveRoom,
  onDeclareImposterVictory,
  loading,
}: WordRevealProps) {
  const [showWord, setShowWord] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds to view word
  const [confirmAction, setConfirmAction] = useState<null | 'leave' | 'newWord'>(null);

  const isImposter = currentPlayer.isImposter;

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Auto-transition to discussion/voting phase
      setTimeout(() => {
        // This would trigger a state change to 'voting'
        // For now, we'll just show the continue button
      }, 1000);
    }
  }, [timeLeft]);

  return (
    <div className='space-y-6'>
      {/* First Word Display */}
      <div className='text-center'>
        <div className='bg-light-card dark:bg-dark-card rounded-lg p-6 border border-light-border dark:border-dark-border mb-4'>
          <h3 className='text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-2'>
            First Word to Start Discussion:
          </h3>
          <div className='text-2xl font-bold text-blue-600 dark:text-blue-400 mb-3'>
            "{room.firstWord}"
          </div>
          {room.firstPlayerId && (
            <div className='text-sm text-light-text-secondary dark:text-dark-text-secondary'>
              <strong>
                {room.players.find((p) => p.id === room.firstPlayerId)?.name || 'Someone'}
              </strong>{' '}
              should start the discussion with this word
              {room.firstPlayerId === currentPlayer.id && " (That's you!)"}
            </div>
          )}
        </div>

        <div className='inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full'>
          <MessageCircle size={16} />
          <span className='font-semibold'>
            {timeLeft > 0 ? `${timeLeft}s remaining` : 'Time to discuss!'}
          </span>
        </div>
      </div>

      {/* Word Reveal Card */}
      <div className='mx-auto'>
        <div className='bg-light-card dark:bg-dark-card rounded-lg p-8 border border-light-border dark:border-dark-border text-center'>
          {isImposter ? (
            // Imposter view
            <div className='space-y-4'>
              <div className='w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto'>
                <Eye size={24} className='text-white' />
              </div>

              <h3 className='text-2xl font-bold text-red-500'>You are the IMPOSTER!</h3>

              <div className='space-y-2'>
                <p className='text-light-text-secondary dark:text-dark-text-secondary'>
                  You don't know the secret word.
                </p>
                <p className='text-sm text-light-text-secondary dark:text-dark-text-secondary'>
                  Listen carefully to others and try to blend in!
                </p>
              </div>

              <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4'>
                <p className='text-sm text-red-700 dark:text-red-300 font-medium'>
                  🎯 Your goal: Don't get caught!
                </p>
                <p className='text-xs text-red-600 dark:text-red-400 mt-1'>
                  If you avoid getting the most votes, you win!
                </p>
              </div>
            </div>
          ) : (
            // Regular player view
            <div className='space-y-4'>
              <div className='w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto'>
                <Eye size={24} className='text-white' />
              </div>

              <h3 className='text-xl font-bold text-light-text-primary dark:text-dark-text-primary'>
                The secret word is:
              </h3>

              {!showWord ? (
                <div className='space-y-4'>
                  <div className='bg-gray-200 dark:bg-gray-700 rounded-lg p-6'>
                    <EyeOff size={32} className='text-gray-400 mx-auto mb-2' />
                    <p className='text-gray-500 dark:text-gray-400 text-sm'>
                      Click to reveal the word
                    </p>
                  </div>

                  <button
                    onClick={() => setShowWord(true)}
                    className='w-full px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-semibold'
                  >
                    Reveal Word
                  </button>
                </div>
              ) : (
                <div className='space-y-4'>
                  <div className='bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-lg p-6'>
                    <div className='text-3xl font-bold text-green-700 dark:text-green-300 mb-2'>
                      {room.word}
                    </div>
                    <p className='text-sm text-green-600 dark:text-green-400'>
                      Remember this word!
                    </p>
                  </div>

                  <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4'>
                    <p className='text-sm text-blue-700 dark:text-blue-300 font-medium'>
                      🕵️ Your goal: Find the imposter!
                    </p>
                    <p className='text-xs text-blue-600 dark:text-blue-400 mt-1'>
                      The imposter doesn't know this word. Use it wisely in discussion!
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className='bg-light-card dark:bg-dark-card rounded-lg p-6 border border-light-border dark:border-dark-border'>
        <h4 className='font-semibold text-light-text-primary dark:text-dark-text-primary mb-3'>
          What happens next:
        </h4>

        <div className='space-y-2 text-sm text-light-text-secondary dark:text-dark-text-secondary'>
          <div className='flex items-start gap-3'>
            <span className='flex-shrink-0 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs'>
              1
            </span>
            <p>Discuss with other players (in real life) about the word</p>
          </div>

          <div className='flex items-start gap-3'>
            <span className='flex-shrink-0 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs'>
              2
            </span>
            <p>Try to figure out who doesn't know the word</p>
          </div>

          <div className='flex items-start gap-3'>
            <span className='flex-shrink-0 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs'>
              3
            </span>
            <p>When ready, everyone will vote for who they think is the imposter</p>
          </div>
        </div>
      </div>

      {/* Host Controls */}
      {currentPlayer.isHost && (
        <div className='bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6'>
          <h4 className='font-semibold text-yellow-800 dark:text-yellow-200 mb-3 flex items-center gap-2'>
            👑 Host Controls
          </h4>
          <div className='space-y-3'>
            <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4'>
              <p className='text-sm text-red-700 dark:text-red-300 font-medium mb-2'>
                🎯 Did the imposter guess the word correctly?
              </p>
              <p className='text-xs text-red-600 dark:text-red-400 mb-3'>
                If the imposter said "{room.word}" out loud, click this button to end the round and
                award them the victory!
              </p>
              <button
                onClick={() => onDeclareImposterVictory(currentPlayer.id)}
                disabled={loading}
                className='w-full px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold'
              >
                {loading ? 'Declaring Victory...' : 'Imposter Guessed Correctly!'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Continue Button (appears after timer or when word is revealed) */}
      {(timeLeft === 0 || (showWord && !isImposter) || isImposter) && (
        <div className='text-center'>
          <p className='text-sm text-light-text-secondary dark:text-dark-text-secondary mb-4'>
            Ready to start voting? Discuss first, then continue when everyone is ready!
          </p>
          <div className='flex flex-col sm:flex-row gap-3 justify-center'>
            <button
              onClick={onContinue}
              disabled={loading}
              className='px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold'
            >
              {loading ? 'Starting Voting...' : 'Start Voting Phase'}
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setConfirmAction('leave')}
        className='px-6 py-3 bg-pink-500 hover:bg-pink-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold'
      >
        {loading ? 'Loading...' : 'Logout'}
      </button>

      {/* Get new word button (with confirm) */}
      <button
        onClick={() => setConfirmAction('newWord')}
        className='px-6 py-3 bg-pink-500 hover:bg-pink-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold'
      >
        {loading ? 'Loading...' : 'Get a New Word'}
      </button>

      {/* Render confirmation modal */}
      {confirmAction && (
        <ConfirmationModal
          message={
            confirmAction === 'leave'
              ? 'Are you sure you want to leave the room?'
              : 'Are you sure you want to get a new word?'
          }
          onCancel={() => setConfirmAction(null)}
          onConfirm={() => {
            if (confirmAction === 'leave') {
              onLeaveRoom();
            } else if (confirmAction === 'newWord') {
              onGetNewWord();
            }
            setConfirmAction(null);
          }}
        />
      )}
    </div>
  );
}

const ConfirmationModal = ({
  message,
  onConfirm,
  onCancel,
}: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) => (
  <div className='fixed inset-0 flex items-center justify-center bg-black/50 z-50'>
    <div className='bg-white dark:bg-dark-card p-6 rounded-lg shadow-lg max-w-sm w-full'>
      <p className='text-light-text-primary dark:text-dark-text-primary mb-4'>{message}</p>
      <div className='flex justify-end gap-3'>
        <button
          onClick={onCancel}
          className='px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors'
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className='px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition-colors'
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
);
