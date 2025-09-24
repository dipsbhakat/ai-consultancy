import React, { forwardRef, HTMLAttributes, ReactNode } from 'react';

// Card Component Types
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

// Card Component
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({
    variant = 'default',
    padding = 'md',
    hover = false,
    className = '',
    children,
    ...props
  }, ref) => {
    const baseClasses = [
      'rounded-lg',
      'transition-all',
      'duration-200',
    ].join(' ');

    const variantClasses = {
      default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
      elevated: 'bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700',
      outlined: 'bg-transparent border-2 border-gray-200 dark:border-gray-700',
      ghost: 'bg-gray-50 dark:bg-gray-900 border-0',
    };

    const paddingClasses = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    const hoverClasses = hover
      ? 'hover:shadow-md hover:scale-[1.02] cursor-pointer'
      : '';

    const combinedClasses = [
      baseClasses,
      variantClasses[variant],
      paddingClasses[padding],
      hoverClasses,
      className,
    ].filter(Boolean).join(' ');

    return (
      <div ref={ref} className={combinedClasses} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// CardHeader Component
interface CardHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  description,
  action,
  className = '',
  children,
  ...props
}) => {
  return (
    <div className={`flex items-start justify-between mb-4 ${className}`} {...props}>
      <div className="min-w-0 flex-1">
        {title && (
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
            {title}
          </h3>
        )}
        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>
        )}
        {children}
      </div>
      {action && <div className="ml-4 flex-shrink-0">{action}</div>}
    </div>
  );
};

// CardContent Component
interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

export const CardContent: React.FC<CardContentProps> = ({
  className = '',
  children,
  ...props
}) => {
  return (
    <div className={`${className}`} {...props}>
      {children}
    </div>
  );
};

// CardFooter Component
interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  justify?: 'start' | 'center' | 'end' | 'between';
}

export const CardFooter: React.FC<CardFooterProps> = ({
  justify = 'end',
  className = '',
  children,
  ...props
}) => {
  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
  };

  return (
    <div
      className={`flex items-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 ${justifyClasses[justify]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
