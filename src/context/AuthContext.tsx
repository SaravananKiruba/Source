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
  'finance@abiestates.com': { password: 'finance123', user: { id: 'U002', email: 'finance@abiestates.com', name: 'Finance Manager', role: 'Finance' as const } },
  'businessowner@abiestates.com': { password: 'owner123', user: { id: 'U003', email: 'businessowner@abiestates.com', name: 'Business Owner', role: 'BusinessOwner' as const } },
  'crm@abiestates.com': { password: 'crm123', user: { id: 'U004', email: 'crm@abiestates.com', name: 'CRM Executive', role: 'CRM' as const } },
  'sales@abiestates.com': { password: 'sales123', user: { id: 'U005', email: 'sales@abiestates.com', name: 'Sales Executive', role: 'Sales' as const } },
  'legal@abiestates.com': { password: 'legal123', user: { id: 'U006', email: 'legal@abiestates.com', name: 'Legal Advisor', role: 'Legal' as const } },
  'hr@abiestates.com': { password: 'hr123', user: { id: 'U007', email: 'hr@abiestates.com', name: 'HR Manager', role: 'HR' as const } },
  'user@abiestates.com': { password: 'user123', user: { id: 'U008', email: 'user@abiestates.com', name: 'General User', role: 'User' as const } },
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
      'create-order': ['Sales', 'CRM', 'Admin'],
      'view-orders': ['Sales', 'CRM', 'Finance', 'Legal', 'Admin', 'BusinessOwner', 'User'],
      'confirm-payment': ['Finance', 'Admin'],
      'record-bank-payment': ['Finance', 'Admin'],
      'send-payment-link': ['CRM', 'Admin'],
      'manage-plots': ['CRM', 'Admin'],
      'view-reports': ['BusinessOwner', 'Admin', 'Finance'],
      'lock-forms': ['CRM', 'Admin'],
      'approve-registration': ['Legal', 'Admin'],
      'assign-token': ['Legal', 'Admin'],
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
