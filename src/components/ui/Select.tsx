import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import BaseDropdown from './BaseDropdown';

interface SelectProps {
  value: string | number;
  onChange: (value: string) => void;
  options: { value: string | number; label: string }[];
  className?: string;
  placeholder?: string;
  label?: string;
}

const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  className = '',
  placeholder = 'Select...',
  label,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((option) => option.value === value);
  const displayValue = selectedOption ? selectedOption.label : placeholder;

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className='block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2'>
          {label}
        </label>
      )}

      <div className='relative'>
        <button
          type='button'
          onClick={() => setIsOpen(!isOpen)}
          className='w-full bg-light-background dark:bg-dark-accent border border-light-border dark:border-dark-border rounded-lg px-4 py-3 pr-10 text-left text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary transition-all hover:bg-light-card dark:hover:bg-dark-card'
          aria-haspopup='listbox'
          aria-expanded={isOpen}
        >
          <span
            className={
              selectedOption ? '' : 'text-light-text-secondary dark:text-dark-text-secondary'
            }
          >
            {displayValue}
          </span>
          <ChevronDown
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        <BaseDropdown
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          position='left-0 right-0'
          width='w-full'
        >
          <div className='py-1 max-h-60 overflow-y-auto'>
            {options.map((option) => (
              <button
                key={option.value}
                type='button'
                onClick={() => handleSelect(option.value.toString())}
                className='w-full px-4 py-3 text-left hover:bg-light-background dark:hover:bg-dark-accent transition-colors flex items-center justify-between group'
                role='option'
                aria-selected={value === option.value}
              >
                <span className='text-light-text-primary dark:text-dark-text-primary'>
                  {option.label}
                </span>
                {value === option.value && (
                  <Check className='w-4 h-4 text-light-primary dark:text-dark-primary' />
                )}
              </button>
            ))}
          </div>
        </BaseDropdown>
      </div>
    </div>
  );
};

export default Select;
