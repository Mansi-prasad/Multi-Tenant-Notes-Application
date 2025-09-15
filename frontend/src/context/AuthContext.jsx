import React, { createContext, useState, useEffect } from 'react';
import * as api from '../lib/api';
import { getToken, setToken, clearToken } from '../utils/storage';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(getToken());
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      setToken(token);
    } else {
      clearToken();
    }
  }, [token]);

  async function login(email, password) {
    setLoading(true);
    try {
      const res = await api.login(email, password);
      setTokenState(res.token);
      setUser(res.user);
      localStorage.setItem('user', JSON.stringify(res.user));
      setToken(res.token);
      return res;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setTokenState(null);
    setUser(null);
    localStorage.removeItem('user');
    clearToken();
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
