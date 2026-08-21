import { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../api/apiClient';
import { getToken, setToken, clearToken } from '../utils/token';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const token = getToken();
      if (!token) {
        setIsAuthLoading(false);
        return;
      }

      try {
        const response = await apiClient.get('/auth/me');
        setUser(response.data);
      } catch (err) {
        console.warn('Session expired or invalid token:', err.message);
        clearToken();
        setUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    }

    loadUser();
  }, []);

  const login = async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    const { token, user: userData } = response.data;
    setToken(token);
    setUser(userData);
    return response.data;
  };

  const signup = async (name, email, password) => {
    const response = await apiClient.post('/auth/signup', { name, email, password });
    const { token, user: userData } = response.data;
    setToken(token);
    setUser(userData);
    return response.data;
  };

  const logout = () => {
    clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isAuthLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
