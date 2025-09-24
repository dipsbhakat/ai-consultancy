import React, { HTMLAttributes, ReactNode } from 'react';

// Badge Component Types
export interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'size'> {
  variant?: 'neutral' | 'blue' | 'green' | 'amber' | 'red' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  outline?: boolean;
  removable?: boolean;
  onRemove?: () => void;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

// Badge Component
export const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  size = 'md',
  dot = false,
  outline = false,
  removable = false,
  onRemove,
  leftIcon,
  rightIcon,
  className = '',
  children,
  ...props
}) => {
  const baseClasses = [
    'inline-flex',
    'items-center',
    'font-medium',
    'rounded-full',
    'transition-colors',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
  ].join(' ');

  // Size classes
  const sizeClasses = {
    sm: dot ? 'h-2 w-2' : 'px-2.5 py-0.5 text-xs gap-1',
    md: dot ? 'h-2.5 w-2.5' : 'px-3 py-1 text-sm gap-1.5',
    lg: dot ? 'h-3 w-3' : 'px-4 py-1.5 text-sm gap-2',
  };

  // Variant classes for filled badges
  const filledVariantClasses = {
    neutral: 'bg-slate-100 text-slate-800 focus:ring-slate-500',
    blue: 'bg-blue-100 text-blue-800 focus:ring-blue-500',
    green: 'bg-green-100 text-green-800 focus:ring-green-500',
    amber: 'bg-yellow-100 text-yellow-800 focus:ring-yellow-500',
    red: 'bg-red-100 text-red-800 focus:ring-red-500',
    purple: 'bg-purple-100 text-purple-800 focus:ring-purple-500',
  };

  // Variant classes for outlined badges
  const outlineVariantClasses = {
    neutral: 'border border-slate-200 text-slate-700 bg-slate-50 focus:ring-slate-500',
    blue: 'border border-blue-200 text-blue-700 bg-blue-50 focus:ring-blue-500',
    green: 'border border-green-200 text-green-700 bg-green-50 focus:ring-green-500',
    amber: 'border border-yellow-200 text-yellow-700 bg-yellow-50 focus:ring-yellow-500',
    red: 'border border-red-200 text-red-700 bg-red-50 focus:ring-red-500',
    purple: 'border border-purple-200 text-purple-700 bg-purple-50 focus:ring-purple-500',
  };

  // Dark mode classes
  const darkClasses = {
    neutral: 'dark:bg-slate-800 dark:text-slate-300',
    blue: 'dark:bg-blue-900 dark:text-blue-300',
    green: 'dark:bg-green-900 dark:text-green-300',
    amber: 'dark:bg-yellow-900 dark:text-yellow-300',
    red: 'dark:bg-red-900 dark:text-red-300',
    purple: 'dark:bg-purple-900 dark:text-purple-300',
  };

  const variantClasses = outline
    ? outlineVariantClasses[variant as keyof typeof outlineVariantClasses]
    : filledVariantClasses[variant as keyof typeof filledVariantClasses];

  const combinedClasses = [
    baseClasses,
    sizeClasses[size],
    variantClasses,
    darkClasses[variant as keyof typeof darkClasses],
    className,
  ].filter(Boolean).join(' ');

  if (dot) {
    return <span className={combinedClasses} {...props} />;
  }

  return (
    <span className={combinedClasses} {...props}>
      {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      {removable && onRemove && (
        <button
          type="button"
          className="ml-1 -mr-1 h-4 w-4 rounded-full hover:bg-black hover:bg-opacity-10 focus:outline-none focus:bg-black focus:bg-opacity-10"
          onClick={onRemove}
          aria-label="Remove badge"
        >
          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </span>
  );
};

// Status Badge Component (for specific statuses)
interface StatusBadgeProps extends Omit<BadgeProps, 'variant'> {
  status: 'online' | 'offline' | 'away' | 'busy' | 'active' | 'inactive' | 'pending' | 'approved' | 'rejected';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, ...props }) => {
  const statusVariants = {
    online: 'green',
    offline: 'neutral',
    away: 'amber',
    busy: 'red',
    active: 'green',
    inactive: 'neutral',
    pending: 'amber',
    approved: 'green',
    rejected: 'red',
  } as const;

  const statusLabels = {
    online: 'Online',
    offline: 'Offline',
    away: 'Away',
    busy: 'Busy',
    active: 'Active',
    inactive: 'Inactive',
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
  };

  return (
    <Badge variant={statusVariants[status]} {...props}>
      {props.children || statusLabels[status]}
    </Badge>
  );
};
