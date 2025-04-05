// src/hooks/useAuth.js
import { useState, useEffect } from 'react';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is already logged in (e.g., from localStorage)
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('userId');

    if (token && role && userId) {
      setUser({ token, role, userId });
      setIsLoggedIn(true);
    }
  }, []);

  const login = (token, role, userId) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('userId', userId);
    setUser({ token, role, userId });
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    setUser(null);
    setIsLoggedIn(false);
  };

  return { user, isLoggedIn, login, logout };
};

export default useAuth;