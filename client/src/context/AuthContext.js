import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const token = localStorage.getItem('bitsbids_token');
      const userData = localStorage.getItem('bitsbids_user');
      
      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
      const mockUser = {
        id: '1',
        firstName: email.includes('f2022') ? 'Arjun' : 'Priya',
        lastName: email.includes('f2022') ? 'Sharma' : 'Patel',
        email: email,
        campus: email.includes('goa') ? 'Goa' : 
                email.includes('pilani') ? 'Pilani' : 
                email.includes('hyderabad') ? 'Hyderabad' : 'Dubai',
        role: 'student',
        avatar: null
      };
      
      localStorage.setItem('bitsbids_user', JSON.stringify(mockUser));
      localStorage.setItem('bitsbids_token', 'mock_jwt_token_' + Date.now());
      
      setUser(mockUser);
      setIsAuthenticated(true);
      
      return mockUser;
    } catch (error) {
      throw new Error('Invalid credentials');
    }
  };

  const register = async (userData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newUser = {
        id: Date.now().toString(),
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        campus: userData.campus,
        role: 'student',
        avatar: null
      };
      
      localStorage.setItem('bitsbids_user', JSON.stringify(newUser));
      localStorage.setItem('bitsbids_token', 'mock_jwt_token_' + Date.now());
      
      setUser(newUser);
      setIsAuthenticated(true);
      
      return newUser;
    } catch (error) {
      throw new Error('Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('bitsbids_user');
    localStorage.removeItem('bitsbids_token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('bitsbids_user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
