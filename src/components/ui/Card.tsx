import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl shadow-sm ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
