import React from 'react';

/* ===== BUTTON COMPONENT ===== */

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  ...props
}, ref) => {
  const baseClasses = 'btn';
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    danger: 'btn-danger'
  };
  const sizeClasses = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg'
  };

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      ref={ref}
      className={classes}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="loading-spinner" />}
      {!loading && leftIcon && <span className="btn-icon">{leftIcon}</span>}
      {children}
      {!loading && rightIcon && <span className="btn-icon">{rightIcon}</span>}
    </button>
  );
});

Button.displayName = 'Button';

/* ===== CARD COMPONENT ===== */

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'interactive' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(({
  variant = 'default',
  padding = 'md',
  className = '',
  children,
  ...props
}, ref) => {
  const baseClasses = 'card';
  const variantClasses = {
    default: '',
    interactive: 'card-interactive',
    elevated: 'card-elevated'
  };
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const classes = [
    baseClasses,
    variantClasses[variant],
    paddingClasses[padding],
    className
  ].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={classes} {...props}>
      {children}
    </div>
  );
});

Card.displayName = 'Card';

/* ===== CARD SUB-COMPONENTS ===== */

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({
  className = '',
  children,
  ...props
}, ref) => (
  <div ref={ref} className={`card-header ${className}`} {...props}>
    {children}
  </div>
));

CardHeader.displayName = 'CardHeader';

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({
  className = '',
  children,
  ...props
}, ref) => (
  <div ref={ref} className={`card-content ${className}`} {...props}>
    {children}
  </div>
));

CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({
  className = '',
  children,
  ...props
}, ref) => (
  <div ref={ref} className={`card-footer ${className}`} {...props}>
    {children}
  </div>
));

CardFooter.displayName = 'CardFooter';

/* ===== INPUT COMPONENT ===== */

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = Boolean(error);

  return (
    <div className="input-group">
      {label && (
        <label htmlFor={inputId} className="text-label-sm text-secondary mb-2 block">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-tertiary">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`input ${leftIcon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''} ${className}`}
          aria-invalid={hasError}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-tertiary">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <div id={`${inputId}-error`} className="text-label-sm text-red mt-1">
          {error}
        </div>
      )}
      {hint && !error && (
        <div id={`${inputId}-hint`} className="text-label-sm text-tertiary mt-1">
          {hint}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

/* ===== BADGE COMPONENT ===== */

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'neutral' | 'blue' | 'green' | 'amber' | 'red' | 'purple';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(({
  variant = 'neutral',
  size = 'md',
  icon,
  className = '',
  children,
  ...props
}, ref) => {
  const baseClasses = 'badge';
  const variantClasses = {
    neutral: 'badge-neutral',
    blue: 'badge-blue',
    green: 'badge-green',
    amber: 'badge-amber',
    red: 'badge-red',
    purple: 'badge-purple'
  };
  const sizeClasses = {
    sm: 'text-label-sm px-1 py-0.5',
    md: 'text-label-sm px-2 py-1'
  };

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  ].filter(Boolean).join(' ');

  return (
    <span ref={ref} className={classes} {...props}>
      {icon && <span className="badge-icon">{icon}</span>}
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';

/* ===== TEXT COMPONENT ===== */

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  variant?: 
    | 'display-lg' | 'display-md' | 'display-sm'
    | 'heading-lg' | 'heading-md' | 'heading-sm'
    | 'body-lg' | 'body-md' | 'body-sm'
    | 'label-lg' | 'label-md' | 'label-sm';
  color?: 'primary' | 'secondary' | 'tertiary' | 'inverse' | 'blue' | 'green' | 'amber' | 'red' | 'purple';
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
}

export const Text = React.forwardRef<HTMLElement, TextProps>(({
  as: Component = 'p',
  variant = 'body-md',
  color = 'primary',
  weight,
  className = '',
  children,
  ...props
}, ref) => {
  const variantClasses = {
    'display-lg': 'text-display-lg',
    'display-md': 'text-display-md',
    'display-sm': 'text-display-sm',
    'heading-lg': 'text-heading-lg',
    'heading-md': 'text-heading-md',
    'heading-sm': 'text-heading-sm',
    'body-lg': 'text-body-lg',
    'body-md': 'text-body-md',
    'body-sm': 'text-body-sm',
    'label-lg': 'text-label-lg',
    'label-md': 'text-label-md',
    'label-sm': 'text-label-sm'
  };

  const colorClasses = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    tertiary: 'text-tertiary',
    inverse: 'text-inverse',
    blue: 'text-blue',
    green: 'text-green',
    amber: 'text-amber',
    red: 'text-red',
    purple: 'text-purple'
  };

  const weightClasses = weight ? {
    regular: 'font-regular',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  }[weight] : '';

  const classes = [
    variantClasses[variant],
    colorClasses[color],
    weightClasses,
    className
  ].filter(Boolean).join(' ');

  return (
    <Component ref={ref as any} className={classes} {...props}>
      {children}
    </Component>
  );
});

Text.displayName = 'Text';

/* ===== SKELETON COMPONENT ===== */

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'rectangular' | 'circular';
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(({
  width,
  height,
  variant = 'rectangular',
  className = '',
  style,
  ...props
}, ref) => {
  const variantClasses = {
    text: 'h-4',
    rectangular: 'h-12',
    circular: 'rounded-full'
  };

  const baseClasses = 'skeleton';
  const classes = [
    baseClasses,
    variantClasses[variant],
    className
  ].filter(Boolean).join(' ');

  const combinedStyle = {
    width,
    height,
    ...style
  };

  return (
    <div
      ref={ref}
      className={classes}
      style={combinedStyle}
      aria-label="Loading..."
      {...props}
    />
  );
});

Skeleton.displayName = 'Skeleton';
