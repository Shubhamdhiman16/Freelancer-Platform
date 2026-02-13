import { createContext, useContext, useEffect, useState } from 'react';
import { apiClient } from '@/integrations/mongodb/client';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        const userData = await apiClient.get('/api/auth/me');
        if (userData && userData.user) {
          setUser(userData.user);
          setRole(userData.user.role || 'user');
        } else {
          localStorage.removeItem('authToken');
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      localStorage.removeItem('authToken');
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      const response = await apiClient.post('/api/auth/signin', { email, password });
      if (response && response.token) {
        localStorage.setItem('authToken', response.token);
        setUser(response.user);
        setRole(response.user?.role || 'user');
        return { error: null };
      }
      return { error: 'Invalid response from server' };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: error.message || 'Sign in failed' };
    }
  };

  const signUp = async (email, password, fullName) => {
    try {
      const response = await apiClient.post('/api/auth/signup', { 
        email, 
        password, 
        fullName 
      });
      if (response && response.token) {
        localStorage.setItem('authToken', response.token);
        setUser(response.user);
        setRole(response.user?.role || 'user');
        return { error: null };
      }
      return { error: 'Invalid response from server' };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error: error.message || 'Sign up failed' };
    }
  };

  const signOut = async () => {
    try {
      await apiClient.post('/api/auth/signout', {});
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      localStorage.removeItem('authToken');
      setUser(null);
      setRole(null);
    }
  };

  const value = {
    user,
    role,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
