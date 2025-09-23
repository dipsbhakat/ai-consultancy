import React, { createContext, useContext, useEffect, useState } from 'react';

/* ===== THEME TYPES ===== */

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

/* ===== THEME CONTEXT ===== */

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

/* ===== THEME PROVIDER ===== */

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'system',
  storageKey = 'app-theme'
}) => {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');

  // Get system preference
  const getSystemTheme = (): ResolvedTheme => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  };

  // Resolve theme based on current setting
  const resolveTheme = (currentTheme: Theme): ResolvedTheme => {
    if (currentTheme === 'system') {
      return getSystemTheme();
    }
    return currentTheme;
  };

  // Load theme from storage on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(storageKey) as Theme;
      if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
        setThemeState(savedTheme);
      }
    } catch (error) {
      console.warn('Failed to load theme from localStorage:', error);
    }
  }, [storageKey]);

  // Update resolved theme when theme changes or system preference changes
  useEffect(() => {
    const newResolvedTheme = resolveTheme(theme);
    setResolvedTheme(newResolvedTheme);

    // Apply theme to document
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(newResolvedTheme);
    root.setAttribute('data-theme', newResolvedTheme);

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        newResolvedTheme === 'dark' ? '#1a1a1a' : '#ffffff'
      );
    }
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = () => {
        setResolvedTheme(getSystemTheme());
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  // Set theme and persist to storage
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(storageKey, newTheme);
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
  };

  // Toggle between light and dark (ignoring system)
  const toggleTheme = () => {
    const newTheme = resolvedTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        setTheme,
        toggleTheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

/* ===== THEME TOGGLE COMPONENT ===== */

export const ThemeToggle: React.FC<{
  variant?: 'icon' | 'dropdown' | 'switch';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}> = ({ 
  variant = 'icon', 
  size = 'md',
  showLabel = false 
}) => {
  const { theme, resolvedTheme, setTheme } = useTheme();

  if (variant === 'dropdown') {
    return (
      <div className="theme-toggle-dropdown">
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as Theme)}
          className={`theme-select theme-select-${size}`}
          aria-label="Select theme"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </select>
      </div>
    );
  }

  if (variant === 'switch') {
    return (
      <div className={`theme-toggle-switch theme-toggle-${size}`}>
        {showLabel && (
          <span className="theme-label">
            {resolvedTheme === 'dark' ? 'Dark' : 'Light'} Mode
          </span>
        )}
        <button
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          className={`theme-switch ${resolvedTheme === 'dark' ? 'theme-switch-dark' : 'theme-switch-light'}`}
          aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
        >
          <span className="theme-switch-thumb">
            {resolvedTheme === 'dark' ? <MoonIcon /> : <SunIcon />}
          </span>
        </button>
      </div>
    );
  }

  // Icon variant (default)
  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className={`theme-toggle-icon theme-toggle-${size}`}
      aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {resolvedTheme === 'dark' ? <SunIcon /> : <MoonIcon />}
      {showLabel && (
        <span className="theme-label">
          {resolvedTheme === 'dark' ? 'Light' : 'Dark'} Mode
        </span>
      )}
    </button>
  );
};

/* ===== THEME ICONS ===== */

const SunIcon: React.FC = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);

const MoonIcon: React.FC = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

export default ThemeProvider;
