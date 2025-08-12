import React, { forwardRef } from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  className?: string;
  disabled?: boolean;
  error?: string;
  width?: string;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, className = '', error, disabled = false, width, ...props }, ref) => {
    // Base classes
    const baseClasses =
      'w-full px-6 py-3 bg-light-background dark:bg-dark-accent border border-light-border dark:border-white/10 rounded-xl text-light-text-primary dark:text-white placeholder-light-text-muted dark:placeholder-white/30 focus:outline-none focus:ring-2 focus:border-transparent focus:ring-light-primary dark:focus:ring-dark-primary transition-all';

    // Conditional classes
    const disabledClasses = disabled ? 'opacity-50 cursor-auto' : '';
    const errorClasses = error ? 'border-red-400' : '';

    // Combine all classes
    const textareaClasses = `${baseClasses} ${disabledClasses} ${errorClasses} ${className}`;

    return (
      <div className='space-y-1' style={{ width }}>
        {label && (
          <label className='block text-sm font-medium text-light-text-primary dark:text-white/80'>
            {label}
          </label>
        )}

        <div className='relative'>
          <textarea ref={ref} disabled={disabled} className={textareaClasses} {...props} />
        </div>

        {error && <p className='text-red-400 text-sm'>{error}</p>}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';
export default TextArea;
