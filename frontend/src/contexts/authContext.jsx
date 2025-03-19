import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on initial load
  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await authService.isAuthenticated();
      setIsAuthenticated(authenticated);
    };
    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      await authService.login(username, password);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      console.error(err);
      setIsAuthenticated(false);
      return false;
    }
  };

  const logout = async () => {
    await authService.logout();
    setIsAuthenticated(false);
  };

  return (
      <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
        {children}
      </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);