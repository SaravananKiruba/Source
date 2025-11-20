import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  hasPermission: (action: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockCredentials = {
  'admin@abiestates.com': { password: 'admin123', user: { id: 'U001', email: 'admin@abiestates.com', name: 'Admin User', role: 'Admin' as const } },
  'sales@abiestates.com': { password: 'sales123', user: { id: 'U002', email: 'sales@abiestates.com', name: 'Sales Executive', role: 'Sales' as const } },
  'accounts@abiestates.com': { password: 'accounts123', user: { id: 'U003', email: 'accounts@abiestates.com', name: 'Accounts Manager', role: 'Accounts' as const } },
  'legal@abiestates.com': { password: 'legal123', user: { id: 'U004', email: 'legal@abiestates.com', name: 'Legal Advisor', role: 'Legal' as const } },
  'logistics@abiestates.com': { password: 'logistics123', user: { id: 'U005', email: 'logistics@abiestates.com', name: 'Logistics Officer', role: 'Logistics' as const } },
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = (email: string, password: string): boolean => {
    const credential = mockCredentials[email as keyof typeof mockCredentials];
    if (credential && credential.password === password) {
      setUser(credential.user);
      localStorage.setItem('user', JSON.stringify(credential.user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const hasPermission = (action: string): boolean => {
    if (!user) return false;
    if (user.role === 'Admin') return true;

    const permissions: Record<string, string[]> = {
      'create-booking': ['Sales', 'Admin'],
      'view-bookings': ['Sales', 'Accounts', 'Legal', 'Admin', 'Management'],
      'confirm-payment': ['Accounts', 'Admin'],
      'create-registration': ['Sales', 'Admin'],
      'approve-registration': ['Legal', 'Admin'],
      'assign-token': ['Legal', 'Admin'],
      'handover-documents': ['Logistics', 'Admin'],
    };

    return permissions[action]?.includes(user.role) || false;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
