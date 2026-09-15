import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore authenticated session from localStorage on initial load
  useEffect(() => {
    async function restoreSession() {
      const storedToken = localStorage.getItem('infrasync_token');
      const storedUser = localStorage.getItem('infrasync_user');

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setToken(storedToken);

          // Verify token validity with backend
          const res = await authService.getCurrentUser();
          if (res && res.user) {
            setUser(res.user);
            localStorage.setItem('infrasync_user', JSON.stringify(res.user));
          }
        } catch (error) {
          console.warn('Session verification failed, clearing stored tokens:', error.message);
          localStorage.removeItem('infrasync_token');
          localStorage.removeItem('infrasync_user');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    }

    restoreSession();
  }, []);

  /**
   * Log in user
   */
  const login = async (email, password, rememberMe = true) => {
    const data = await authService.login({ email, password });
    if (data && data.token && data.user) {
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('infrasync_token', data.token);
      localStorage.setItem('infrasync_user', JSON.stringify(data.user));
      return data.user;
    }
    throw new Error('Invalid response from server.');
  };

  /**
   * Sign up new user
   */
  const signup = async (formData) => {
    const data = await authService.register(formData);
    if (data && data.token && data.user) {
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('infrasync_token', data.token);
      localStorage.setItem('infrasync_user', JSON.stringify(data.user));
      return data.user;
    }
    throw new Error('Registration failed.');
  };

  /**
   * Log out user
   */
  const logout = async () => {
    await authService.logout();
    setUser(null);
    setToken(null);
    localStorage.removeItem('infrasync_token');
    localStorage.removeItem('infrasync_user');
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    loading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
