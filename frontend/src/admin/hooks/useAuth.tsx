import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AdminUser, AuthResponse, LoginRequest } from '../types';
import { adminAPI } from './useAdminAPI';

interface AuthContextType {
  admin: AdminUser | null;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const accessToken = localStorage.getItem('admin_access_token');
        const refreshToken = localStorage.getItem('admin_refresh_token');
        
        // Check for old token format and migrate
        const oldToken = localStorage.getItem('admin_token');
        if (oldToken && !accessToken) {
          adminAPI.setToken(oldToken);
        }
        
        // Only attempt API calls if we have tokens
        if (accessToken && refreshToken) {
          adminAPI.setTokens(accessToken, refreshToken);
          try {
            // Add timeout and retry logic for initial profile check
            const profile = await Promise.race([
              adminAPI.getProfile(),
              new Promise<never>((_, reject) => 
                setTimeout(() => reject(new Error('Profile fetch timeout')), 5000)
              )
            ]) as AdminUser;
            setAdmin(profile);
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.warn('Failed to get profile during initialization:', errorMessage);
            // Don't clear tokens immediately - they might still be valid
            // Only clear if it's an auth error (401/403)
            if (errorMessage.includes('401') || errorMessage.includes('403') || errorMessage.includes('Authentication failed')) {
              console.log('Clearing invalid tokens');
              adminAPI.clearTokens();
            }
          }
        } else if (accessToken) {
          // Handle case where we only have access token (old format)
          try {
            const profile = await Promise.race([
              adminAPI.getProfile(),
              new Promise<never>((_, reject) => 
                setTimeout(() => reject(new Error('Profile fetch timeout')), 5000)
              )
            ]) as AdminUser;
            setAdmin(profile);
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.warn('Failed to get profile with access token:', errorMessage);
            if (errorMessage.includes('401') || errorMessage.includes('403') || errorMessage.includes('Authentication failed')) {
              adminAPI.clearTokens();
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        // Always set loading to false, even if there are network issues
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      setLoading(true);
      const response: AuthResponse = await adminAPI.login(credentials);
      
      // Create AdminUser object from AuthResponse
      const adminUser: AdminUser = {
        id: response.admin.id,
        email: response.admin.email,
        firstName: response.admin.firstName,
        lastName: response.admin.lastName,
        role: response.admin.role,
        isActive: true, // Assuming active since they can login
        loginAttempts: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setAdmin(adminUser);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await adminAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAdmin(null);
      adminAPI.clearTokens(); // Use new method
    }
  };

  const value: AuthContextType = {
    admin,
    loading,
    login,
    logout,
    isAuthenticated: !!admin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
