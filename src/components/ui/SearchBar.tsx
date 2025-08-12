import { Search } from 'lucide-react';
import React from 'react';

interface SearchBarProps {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  actionIcon?: React.ReactNode;
  onActionClick: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  actionIcon,
  onActionClick,
  placeholder,
}) => {
  return (
    <div className='flex-1 flex items-center gap-2 bg-light-card border border-gray-300 dark:border-none dark:bg-dark-card rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-light-primary dark:focus-within:ring-dark-primary transition-all'>
      <Search className='w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary' />
      <input
        type='text'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || 'Search...'}
        className='flex-1 bg-transparent border-none outline-none text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-secondary dark:placeholder:text-dark-text-secondary'
      />
      <button
        onClick={onActionClick}
        className='hover:bg-light-hover dark:hover:bg-dark-hover rounded-lg transition-colors'
      >
        {actionIcon}
      </button>
    </div>
  );
};

export default SearchBar;
