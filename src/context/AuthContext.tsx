import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mock users for demo
const mockUsers: (User & { password: string })[] = [
  {
    id: 0,
    username: 'superadmin',
    password: 'superadmin123',
    role: 'super-admin',
    name: 'المدير العام',
    email: 'superadmin@church.com'
  },
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    name: 'مدير النظام',
    email: 'admin@church.com'
  },
  {
    id: 2,
    username: 'servant',
    password: 'servant123',
    role: 'user',
    name: 'خادم الكنيسة',
    email: 'servant@church.com'
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    const foundUser = mockUsers.find(
      u => u.username === username && u.password === password
    );

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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
