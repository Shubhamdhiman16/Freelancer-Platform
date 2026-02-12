import { createContext, useContext, useEffect, useState } from 'react';
import { apiClient } from '@/integrations/mongodb/client';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in via token
    const token = localStorage.getItem('authToken');
    if (token) {
      checkAuthStatus();
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuthStatus = async () => {
    try {
      const userData = await apiClient.get('/api/auth/me');
      setUser(userData.user);
      setRole(userData.user.role);
    } catch (error) {
      console.error('Error checking auth status:', error);
      localStorage.removeItem('authToken');
      setUser(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      const response = await apiClient.post('/api/auth/signin', { email, password });
      localStorage.setItem('authToken', response.token);
      setUser(response.user);
      setRole(response.user.role);
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  };

  const signUp = async (email, password, fullName) => {
    try {
      const response = await apiClient.post('/api/auth/signup', { 
        email, 
        password, 
        fullName 
      });
      localStorage.setItem('authToken', response.token);
      setUser(response.user);
      setRole(response.user.role);
      return { error: null };
    } catch (error) {
      return { error: error.message };
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
