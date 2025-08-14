import React from 'react';

interface RadioOption {
  value: string;
  label: string;
}

interface RadioInputProps {
  label: string;
  name: string;
  value: string;
  options: RadioOption[];
  onChange: (value: string) => void;
  className?: string;
}

const RadioInput: React.FC<RadioInputProps> = ({
  label,
  name,
  value,
  options,
  onChange,
  className = '',
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className='block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary'>
        {label}
      </label>
      <div className='space-y-2'>
        {options.map((option) => (
          <label key={option.value} className='flex items-center space-x-2 cursor-pointer'>
            <input
              type='radio'
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className='w-4 h-4 text-light-primary dark:text-dark-primary bg-light-surface dark:bg-dark-surface border-light-border dark:border-dark-border focus:ring-light-primary dark:focus:ring-dark-primary focus:ring-2'
            />
            <span className='text-sm text-light-text-primary dark:text-dark-text-primary'>
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default RadioInput;
