"use client";

import { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  role: string | null;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const BACKEND_URL = "http://localhost:8080";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/auth/verify`, {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(true);
          setRole(data.role.replace('ROLE_', '').toLowerCase());
        } else {
          setIsAuthenticated(false);
          setRole(null);
        }
      } catch (err) {
        console.error('Auth verification error:', err);
        setIsAuthenticated(false);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  const logout = async () => {
    try {
      await fetch(`${BACKEND_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      setIsAuthenticated(false);
      setRole(null);
      document.cookie = 'JWT_TOKEN=; Max-Age=0; path=/;';
      window.location.href = '/auth/signin';
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};