import { useEffect, useRef, useState } from 'react';

interface CustomSelectProps<T> {
  title?: string;
  options: { value: T; label: string }[];
  selectedOption: T;
  label?: T;
  onChange: (value: T) => void;
  disabled?: boolean;
  className?: string;
  width?: string;
  error?: string;
}

const CustomSelect = <T extends string>({
  title,
  options,
  selectedOption,
  label,
  onChange,
  disabled,
  className,
  width,
  error,
}: CustomSelectProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const scrollPositionRef = useRef<number>(0);
  const isScrollingRef = useRef(false);

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen || disabled) return;

      const focusedElement = document.activeElement;
      const items = Array.from(selectRef.current?.querySelectorAll('li') || []);

      if (event.key === 'Escape') {
        setIsOpen(false);
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        const currentIndex = items.indexOf(focusedElement as HTMLLIElement);
        const nextIndex = (currentIndex + 1) % items.length;
        items[nextIndex]?.focus();
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        const currentIndex = items.indexOf(focusedElement as HTMLLIElement);
        const prevIndex = (currentIndex - 1 + items.length) % items.length;
        items[prevIndex]?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, disabled]);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = (e: Event) => {
      if (!isOpen || isScrollingRef.current) return;

      // Check if the scroll event is coming from the dropdown list
      const isScrollingList = listRef.current?.contains(e.target as Node);

      if (!isScrollingList) {
        setIsOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll, true);
    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen]);

  const handleListScroll = () => {
    if (listRef.current) {
      scrollPositionRef.current = listRef.current.scrollTop;
      isScrollingRef.current = true;

      // Reset the flag after scroll ends
      clearTimeout(isScrollingRef.current as any);
      isScrollingRef.current = setTimeout(() => {
        isScrollingRef.current = false;
      }, 100) as any;
    }
  };

  // Base classes
  const baseClasses =
    'w-full px-6 py-3 bg-light-background dark:bg-dark-accent border border-light-border dark:border-dark-border rounded-lg text-light-text-primary dark:text-dark-text-primary placeholder-light-text-secondary dark:placeholder-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary transition-all';

  // Conditional classes
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';
  const errorClasses = error ? 'border-red-500 dark:border-red-400' : '';

  // Combine all classes
  const selectClasses = `${baseClasses} ${disabledClasses} ${errorClasses} ${className}`;

  return (
    <div className='space-y-1' style={{ width }}>
      {title && (
        <label className='block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary'>
          {title}
        </label>
      )}

      <div className='relative' ref={selectRef}>
        <div
          role='button'
          tabIndex={disabled ? -1 : 0}
          aria-haspopup='listbox'
          aria-expanded={isOpen}
          aria-label={title}
          aria-disabled={disabled}
          className={selectClasses}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={(e) => {
            if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
              setIsOpen(!isOpen);
            }
          }}
        >
          {options.find((option) => option.value === selectedOption)?.label ||
            label ||
            selectedOption}
        </div>

        {isOpen && !disabled && (
          <ul
            ref={listRef}
            role='listbox'
            className={`absolute z-50 mt-1 w-full bg-light-background dark:bg-dark-accent border border-light-border dark:border-dark-border rounded-lg shadow-lg max-h-60 overflow-auto`}
            onScroll={handleListScroll}
            style={{
              position: 'fixed',
              width: selectRef.current?.clientWidth,
              top: selectRef.current
                ? Math.min(
                    selectRef.current.getBoundingClientRect().bottom + window.scrollY,
                    window.innerHeight + window.scrollY - 10
                  )
                : 'auto',
              left: selectRef.current
                ? selectRef.current.getBoundingClientRect().left + window.scrollX
                : 'auto',
            }}
          >
            {options.map((option) => (
              <li
                key={option.value}
                role='option'
                aria-selected={option.value === selectedOption}
                tabIndex={0}
                className={`px-6 py-3 cursor-pointer transition-colors duration-200
                  ${
                    option.value === selectedOption
                      ? 'bg-light-primary/10 dark:bg-dark-primary/20 text-light-primary dark:text-dark-primary'
                      : 'text-light-text-primary dark:text-dark-text-primary'
                  }
                  hover:bg-light-primary/10 dark:hover:bg-dark-primary/20
                  hover:text-light-primary dark:hover:text-dark-primary
                  focus:outline-none focus:bg-light-primary/10 dark:focus:bg-dark-primary/20`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onChange(option.value);
                    setIsOpen(false);
                  }
                }}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && <p className='text-red-500 dark:text-red-400 text-sm'>{error}</p>}
    </div>
  );
};

export default CustomSelect;
