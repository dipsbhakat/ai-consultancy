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
      const token = localStorage.getItem('admin_token');
      if (token) {
        try {
          const profile = await adminAPI.getProfile();
          setAdmin(profile);
        } catch (error) {
          console.error('Failed to load admin profile:', error);
          adminAPI.clearToken();
        }
      }
      setLoading(false);
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
      adminAPI.clearToken();
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
