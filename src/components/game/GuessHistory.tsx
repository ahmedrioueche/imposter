import React from 'react';
import { GuessResult } from '@/types/game';
import { GAME_MESSAGES } from '@/constants/game';
import Card from '@/components/ui/Card';

interface GuessHistoryProps {
  guesses: GuessResult[];
}

const GuessHistory: React.FC<GuessHistoryProps> = ({ guesses }) => {
  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage === 100) return 'text-green-600 dark:text-green-400';
    if (percentage >= 75) return 'text-blue-600 dark:text-blue-400';
    if (percentage >= 50) return 'text-yellow-600 dark:text-yellow-400';
    if (percentage >= 25) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreMessage = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage === 100) return GAME_MESSAGES.PERFECT_SCORE;
    if (percentage >= 75) return GAME_MESSAGES.GOOD_SCORE;
    if (percentage >= 25) return GAME_MESSAGES.PARTIAL_SCORE;
    return GAME_MESSAGES.NO_MATCH;
  };

  if (guesses.length === 0) {
    return (
      <Card className='p-6'>
        <h3 className='text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-4'>
          {GAME_MESSAGES.GUESS_HISTORY}
        </h3>
        <div className='text-center py-8'>
          <p className='text-light-text-secondary dark:text-dark-text-secondary'>
            {GAME_MESSAGES.NO_GUESSES_YET}
          </p>
        </div>
      </Card>
    );
  }

  const maxScore = guesses[0]?.guess.length || 1;

  return (
    <Card className='p-6'>
      <h3 className='text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-4 hide-scrollbar'>
        {GAME_MESSAGES.GUESS_HISTORY} ({guesses.length})
      </h3>

      <div className='space-y-3 max-h-96 overflow-y-auto hide-scrollbar'>
        {guesses.map((guess, index) => (
          <div
            key={guess.id}
            className='flex items-center justify-between p-4 bg-light-background dark:bg-dark-accent rounded-lg border border-light-border dark:border-dark-border'
          >
            <div className='flex items-center gap-4'>
              <div className='flex items-center justify-center w-8 h-8 bg-light-primary dark:bg-dark-primary text-white rounded-full text-sm font-bold'>
                {guesses.length - index}
              </div>

              <div>
                <div className='font-mono text-lg font-bold text-light-text-primary dark:text-dark-text-primary'>
                  {guess.guess}
                </div>
                <div className='text-sm text-light-text-secondary dark:text-dark-text-secondary'>
                  {guess.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>

            <div className='text-right'>
              <div className={`text-xl font-bold ${getScoreColor(guess.score, maxScore)}`}>
                {guess.score.toFixed(1)}
              </div>
              <div className='text-xs text-light-text-secondary dark:text-dark-text-secondary'>
                {guess.exactMatches} exact, {guess.partialMatches} partial
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      {guesses.length > 0 && (
        <div className='mt-4 pt-4 border-t border-light-border dark:border-dark-border'>
          <div className='grid grid-cols-3 gap-4 text-center'>
            <div>
              <div className='text-2xl font-bold text-light-primary dark:text-dark-primary'>
                {guesses.length}
              </div>
              <div className='text-sm text-light-text-secondary dark:text-dark-text-secondary'>
                Total Guesses
              </div>
            </div>
            <div>
              <div className='text-2xl font-bold text-green-600 dark:text-green-400'>
                {Math.max(...guesses.map((g) => g.score)).toFixed(1)}
              </div>
              <div className='text-sm text-light-text-secondary dark:text-dark-text-secondary'>
                Best Score
              </div>
            </div>
            <div>
              <div className='text-2xl font-bold text-blue-600 dark:text-blue-400'>
                {(guesses.reduce((sum, g) => sum + g.score, 0) / guesses.length).toFixed(1)}
              </div>
              <div className='text-sm text-light-text-secondary dark:text-dark-text-secondary'>
                Average Score
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default GuessHistory;
