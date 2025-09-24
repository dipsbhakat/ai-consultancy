import React, { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';

// Button Component Types
export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

// Button Component
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    loading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    className = '',
    children,
    disabled,
    ...props
  }, ref) => {
    // Base classes
    const baseClasses = [
      'inline-flex',
      'items-center',
      'justify-center',
      'font-medium',
      'transition-all',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-offset-2',
      'disabled:opacity-50',
      'disabled:cursor-not-allowed',
      'relative',
      'border',
    ].join(' ');

    // Size classes
    const sizeClasses = {
      sm: 'h-8 px-3 text-sm rounded-md gap-1.5',
      md: 'h-10 px-4 text-sm rounded-md gap-2',
      lg: 'h-12 px-6 text-base rounded-md gap-2',
    };

    // Variant classes
    const variantClasses = {
      primary: [
        'bg-blue-600 text-white border-blue-600',
        'hover:bg-blue-700 hover:border-blue-700',
        'focus:ring-blue-500',
        'active:bg-blue-800',
      ].join(' '),
      
      secondary: [
        'bg-gray-100 text-gray-900 border-gray-200',
        'hover:bg-gray-200 hover:border-gray-300',
        'focus:ring-gray-500',
        'active:bg-gray-300',
        'dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700',
        'dark:hover:bg-gray-700 dark:hover:border-gray-600',
      ].join(' '),
      
      ghost: [
        'bg-transparent text-gray-700 border-transparent',
        'hover:bg-gray-100 hover:text-gray-900',
        'focus:ring-gray-500',
        'active:bg-gray-200',
        'dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100',
      ].join(' '),
      
      outline: [
        'bg-transparent text-gray-700 border-gray-300',
        'hover:bg-gray-50 hover:text-gray-900 hover:border-gray-400',
        'focus:ring-gray-500',
        'active:bg-gray-100',
        'dark:text-gray-300 dark:border-gray-600',
        'dark:hover:bg-gray-800 dark:hover:text-gray-100',
      ].join(' '),
      
      destructive: [
        'bg-red-600 text-white border-red-600',
        'hover:bg-red-700 hover:border-red-700',
        'focus:ring-red-500',
        'active:bg-red-800',
      ].join(' '),
    };

    const combinedClasses = [
      baseClasses,
      sizeClasses[size],
      variantClasses[variant],
      fullWidth && 'w-full',
      className,
    ].filter(Boolean).join(' ');

    return (
      <button
        ref={ref}
        className={combinedClasses}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!loading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
        {children}
        {!loading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

// Button Group Component
interface ButtonGroupProps {
  children: ReactNode;
  className?: string;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({ children, className = '' }) => {
  return (
    <div className={`inline-flex rounded-md shadow-sm ${className}`} role="group">
      {children}
    </div>
  );
};
