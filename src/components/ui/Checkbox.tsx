import React from 'react';

interface CheckboxProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  accentColor?: string;
  className?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  id,
  checked,
  onChange,
  label,
  description,
  accentColor = 'green',
  className = '',
}) => {
  const accent = `accent-${accentColor}-500 focus:ring-2 focus:ring-${accentColor}-500`;
  return (
    <div
      className={`flex items-center justify-between p-3 sm:p-4 rounded-xl bg-light-background dark:bg-dark-accent border border-gray-200 dark:border-gray-600 ${className}`}
    >
      <div>
        <label htmlFor={id} className='text-gray-900 dark:text-gray-100 font-medium cursor-pointer'>
          {label}
        </label>
        {description && (
          <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>{description}</p>
        )}
      </div>
      <input
        id={id}
        type='checkbox'
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className={`${accent} w-5 h-5 rounded transition-all bg-light-background dark:bg-dark-accent`}
      />
    </div>
  );
};

export default Checkbox;
