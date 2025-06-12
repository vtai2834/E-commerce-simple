"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProfile, login as apiLogin } from '../lib/api';

type AuthContextType = {
  user: any;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null);
  console.log('AuthProvider rendered, user:', user);

  useEffect(() => {
    console.log('AuthProvider useEffect running');
    // Check if window is defined (client-side)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      console.log('Token from localStorage:', token);
      if (token) {
        getProfile()
          .then((res: any) => {
            console.log('Profile data:', res.data);
            setUser(res.data);
          })
          .catch((error) => {
            console.error('Error fetching profile:', error);
            setUser(null);
          });
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    console.log('Login attempt for email:', email);
    const res = await apiLogin(email, password);
    console.log('Login response:', res.data);
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', res.data.accessToken);
    }
    setUser(res.data.user);
  };

  const logout = () => {
    console.log('Logging out');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    setUser(null);
  };

  const contextValue = { user, login, logout };
  console.log('AuthContext value:', contextValue);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  console.log('useAuth hook called');
  const context = useContext(AuthContext);
  console.log('useAuth context value:', context);
  if (!context) {
    console.error('useAuth must be used within an AuthProvider');
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 