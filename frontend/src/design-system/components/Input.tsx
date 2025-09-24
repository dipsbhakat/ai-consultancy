import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react';

/* ===== TYPES ===== */
interface BaseInputProps {
  label?: string;
  description?: string;
  error?: string;
  success?: string;
  warning?: string;
  required?: boolean;
  disabled?: boolean;
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'ghost';
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  clearable?: boolean;
  onClear?: () => void;
  fullWidth?: boolean;
}

export interface InputProps extends BaseInputProps, Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {}

export interface TextareaProps extends BaseInputProps, Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  rows?: number;
  resizable?: boolean;
  autoResize?: boolean;
}

export interface SelectProps extends BaseInputProps, Omit<InputHTMLAttributes<HTMLSelectElement>, 'size'> {
  children: ReactNode;
  placeholder?: string;
}

/* ===== INPUT COMPONENT ===== */
export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  description,
  error,
  success,
  warning,
  required,
  disabled,
  loading,
  size = 'md',
  variant = 'default',
  icon,
  iconPosition = 'left',
  clearable,
  onClear,
  fullWidth = true,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  // Determine state
  const state = error ? 'error' : success ? 'success' : warning ? 'warning' : 'default';
  
  // Size styles
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  };

  // Variant styles
  const variantStyles = {
    default: `
      border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900
      focus:ring-2 focus:ring-blue-500 focus:border-transparent
    `,
    filled: `
      border-0 bg-gray-100 dark:bg-gray-800
      focus:ring-2 focus:ring-blue-500
    `,
    ghost: `
      border-0 bg-transparent
      focus:ring-2 focus:ring-blue-500 focus:bg-gray-50 dark:focus:bg-gray-800
    `,
  };

  // State styles
  const stateStyles = {
    default: 'focus:ring-blue-500',
    error: 'border-red-300 dark:border-red-600 focus:ring-red-500',
    success: 'border-green-300 dark:border-green-600 focus:ring-green-500',
    warning: 'border-yellow-300 dark:border-yellow-600 focus:ring-yellow-500',
  };

  const baseStyles = `
    rounded-lg transition-all duration-200 ease-in-out
    text-gray-900 dark:text-gray-100
    placeholder:text-gray-400 dark:placeholder:text-gray-500
    ${disabled ? 'bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed' : ''}
    ${loading ? 'cursor-wait' : ''}
    ${fullWidth ? 'w-full' : ''}
  `;

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Description */}
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          {description}
        </p>
      )}

      {/* Input wrapper */}
      <div className="relative">
        {/* Left icon */}
        {icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="text-gray-400 dark:text-gray-500">
              {icon}
            </div>
          </div>
        )}

        {/* Input */}
        <input
          ref={ref}
          id={inputId}
          disabled={disabled || loading}
          className={`
            ${baseStyles}
            ${sizeStyles[size]}
            ${variantStyles[variant]}
            ${stateStyles[state]}
            ${icon && iconPosition === 'left' ? 'pl-10' : ''}
            ${icon && iconPosition === 'right' ? 'pr-10' : ''}
            ${clearable && props.value ? 'pr-10' : ''}
          `}
          {...props}
        />

        {/* Right icon */}
        {icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <div className="text-gray-400 dark:text-gray-500">
              {icon}
            </div>
          </div>
        )}

        {/* Loading spinner */}
        {loading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600"></div>
          </div>
        )}

        {/* Clear button */}
        {clearable && props.value && onClear && !loading && (
          <button
            type="button"
            onClick={onClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* State messages */}
      {(error || success || warning) && (
        <div className="mt-2 flex items-center space-x-2">
          {error && (
            <>
              <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
            </>
          )}
          {success && (
            <>
              <CheckCircleIcon className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600 dark:text-green-400">{success}</span>
            </>
          )}
          {warning && (
            <>
              <ExclamationTriangleIcon className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-yellow-600 dark:text-yellow-400">{warning}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

/* ===== TEXTAREA COMPONENT ===== */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  description,
  error,
  success,
  warning,
  required,
  disabled,
  loading,
  size = 'md',
  variant = 'default',
  rows = 4,
  resizable = true,
  autoResize = false,
  fullWidth = true,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  
  // Determine state
  const state = error ? 'error' : success ? 'success' : warning ? 'warning' : 'default';
  
  // Size styles
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  };

  // Variant styles
  const variantStyles = {
    default: `
      border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900
      focus:ring-2 focus:ring-blue-500 focus:border-transparent
    `,
    filled: `
      border-0 bg-gray-100 dark:bg-gray-800
      focus:ring-2 focus:ring-blue-500
    `,
    ghost: `
      border-0 bg-transparent
      focus:ring-2 focus:ring-blue-500 focus:bg-gray-50 dark:focus:bg-gray-800
    `,
  };

  // State styles
  const stateStyles = {
    default: 'focus:ring-blue-500',
    error: 'border-red-300 dark:border-red-600 focus:ring-red-500',
    success: 'border-green-300 dark:border-green-600 focus:ring-green-500',
    warning: 'border-yellow-300 dark:border-yellow-600 focus:ring-yellow-500',
  };

  const baseStyles = `
    rounded-lg transition-all duration-200 ease-in-out
    text-gray-900 dark:text-gray-100
    placeholder:text-gray-400 dark:placeholder:text-gray-500
    ${disabled ? 'bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed' : ''}
    ${loading ? 'cursor-wait' : ''}
    ${fullWidth ? 'w-full' : ''}
    ${!resizable ? 'resize-none' : ''}
    ${autoResize ? 'resize-none overflow-hidden' : ''}
  `;

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Description */}
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          {description}
        </p>
      )}

      {/* Textarea wrapper */}
      <div className="relative">
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          disabled={disabled || loading}
          className={`
            ${baseStyles}
            ${sizeStyles[size]}
            ${variantStyles[variant]}
            ${stateStyles[state]}
          `}
          {...props}
        />

        {/* Loading spinner */}
        {loading && (
          <div className="absolute top-3 right-3">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600"></div>
          </div>
        )}
      </div>

      {/* State messages */}
      {(error || success || warning) && (
        <div className="mt-2 flex items-center space-x-2">
          {error && (
            <>
              <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
            </>
          )}
          {success && (
            <>
              <CheckCircleIcon className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600 dark:text-green-400">{success}</span>
            </>
          )}
          {warning && (
            <>
              <ExclamationTriangleIcon className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-yellow-600 dark:text-yellow-400">{warning}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

/* ===== SELECT COMPONENT ===== */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  description,
  error,
  success,
  warning,
  required,
  disabled,
  loading,
  size = 'md',
  variant = 'default',
  placeholder,
  children,
  fullWidth = true,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
  
  // Determine state
  const state = error ? 'error' : success ? 'success' : warning ? 'warning' : 'default';
  
  // Size styles
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  };

  // Variant styles
  const variantStyles = {
    default: `
      border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900
      focus:ring-2 focus:ring-blue-500 focus:border-transparent
    `,
    filled: `
      border-0 bg-gray-100 dark:bg-gray-800
      focus:ring-2 focus:ring-blue-500
    `,
    ghost: `
      border-0 bg-transparent
      focus:ring-2 focus:ring-blue-500 focus:bg-gray-50 dark:focus:bg-gray-800
    `,
  };

  // State styles
  const stateStyles = {
    default: 'focus:ring-blue-500',
    error: 'border-red-300 dark:border-red-600 focus:ring-red-500',
    success: 'border-green-300 dark:border-green-600 focus:ring-green-500',
    warning: 'border-yellow-300 dark:border-yellow-600 focus:ring-yellow-500',
  };

  const baseStyles = `
    rounded-lg transition-all duration-200 ease-in-out appearance-none
    text-gray-900 dark:text-gray-100
    ${disabled ? 'bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed' : ''}
    ${loading ? 'cursor-wait' : ''}
    ${fullWidth ? 'w-full' : ''}
    pr-10
  `;

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Description */}
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          {description}
        </p>
      )}

      {/* Select wrapper */}
      <div className="relative">
        <select
          ref={ref}
          id={inputId}
          disabled={disabled || loading}
          className={`
            ${baseStyles}
            ${sizeStyles[size]}
            ${variantStyles[variant]}
            ${stateStyles[state]}
          `}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {children}
        </select>

        {/* Dropdown icon */}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600"></div>
          ) : (
            <ChevronDownIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          )}
        </div>
      </div>

      {/* State messages */}
      {(error || success || warning) && (
        <div className="mt-2 flex items-center space-x-2">
          {error && (
            <>
              <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
            </>
          )}
          {success && (
            <>
              <CheckCircleIcon className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600 dark:text-green-400">{success}</span>
            </>
          )}
          {warning && (
            <>
              <ExclamationTriangleIcon className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-yellow-600 dark:text-yellow-400">{warning}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
});

Select.displayName = 'Select';

/* ===== FORM GROUP ===== */
export const FormGroup = ({ 
  children, 
  className = '' 
}: { 
  children: ReactNode; 
  className?: string; 
}) => (
  <div className={`space-y-6 ${className}`}>
    {children}
  </div>
);

export const FormRow = ({ 
  children, 
  className = '' 
}: { 
  children: ReactNode; 
  className?: string; 
}) => (
  <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
    {children}
  </div>
);

/* ===== ICON COMPONENTS ===== */
const XMarkIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ExclamationTriangleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
  </svg>
);

const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);
