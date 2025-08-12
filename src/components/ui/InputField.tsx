import { Eye, EyeOff } from 'lucide-react';
import React, { forwardRef, useState } from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
  disabled?: boolean;
  error?: string;
  width?: string;
  icon?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    { label, className = '', error, disabled = false, width, type, icon, endAdornment, ...props },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    // Handle password type toggle
    const isPassword = type === 'password';
    const computedType = isPassword && showPassword ? 'text' : type;

    // Default right icon for password fields
    const defaultRightIcon = isPassword ? (
      <button
        type='button'
        onClick={() => setShowPassword(!showPassword)}
        className='text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors'
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    ) : null;

    const finalRightIcon = endAdornment || defaultRightIcon;

    // Base classes
    const baseClasses =
      'w-full bg-light-background dark:bg-dark-accent border border-light-border dark:border-dark-border rounded-lg text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary transition-all';

    // Conditional classes
    const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';
    const errorClasses = error ? 'border-red-500 dark:border-red-400' : '';
    const paddingClasses = icon ? 'pl-10 pr-4' : 'px-4';
    const heightClasses = 'py-3';

    // Combine all classes
    const inputClasses = `${baseClasses} ${paddingClasses} ${heightClasses} ${disabledClasses} ${errorClasses} ${className}`;

    return (
      <div className='space-y-1 w-full' style={{ width }}>
        {label && (
          <label className='block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2'>
            {label}
          </label>
        )}

        <div className='relative'>
          {icon && (
            <div className='absolute left-3 top-1/2 transform -translate-y-1/2 text-light-text-secondary dark:text-dark-text-secondary'>
              {icon}
            </div>
          )}
          <input
            ref={ref}
            disabled={disabled}
            type={computedType}
            className={inputClasses}
            {...props}
          />
          {finalRightIcon && (
            <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
              {finalRightIcon}
            </div>
          )}
        </div>

        {error && <p className='text-red-500 dark:text-red-400 text-sm mt-2'>{error}</p>}
      </div>
    );
  }
);

InputField.displayName = 'InputField';
export default InputField;
