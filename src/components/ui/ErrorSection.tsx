import React from 'react';

interface ErrorSectionProps {
  text: string;
  icon?: React.ReactNode;
  subtext?: string;
}

const ErrorSection: React.FC<ErrorSectionProps> = ({ text, icon, subtext }) => {
  return (
    <div className='flex flex-col items-center justify-center py-16 px-4'>
      <div className='mb-6'>{icon || <span className='text-6xl text-red-500'>❌</span>}</div>
      <h2 className='text-2xl md:text-3xl font-bold text-red-600 dark:text-red-400 mb-2 text-center'>
        {text}
      </h2>
      {subtext && (
        <p className='text-light-text-secondary dark:text-dark-text-secondary text-center max-w-md'>
          {subtext}
        </p>
      )}
    </div>
  );
};

export default ErrorSection;
