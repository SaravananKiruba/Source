import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CustomerUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  bookingToken?: string;
}

interface CustomerAuthContextType {
  customer: CustomerUser | null;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => void;
  setBookingToken: (token: string) => void;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

// Mock Google OAuth response
const mockGoogleLogin = (): CustomerUser => {
  return {
    id: `CUST${Date.now()}`,
    email: 'customer@example.com',
    name: 'John Doe',
    picture: 'https://via.placeholder.com/100',
  };
};

export const CustomerAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [customer, setCustomer] = useState<CustomerUser | null>(() => {
    const stored = localStorage.getItem('customer');
    return stored ? JSON.parse(stored) : null;
  });

  const loginWithGoogle = async (): Promise<boolean> => {
    // Mock Google OAuth flow
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = mockGoogleLogin();
        setCustomer(user);
        localStorage.setItem('customer', JSON.stringify(user));
        resolve(true);
      }, 1000);
    });
  };

  const logout = () => {
    setCustomer(null);
    localStorage.removeItem('customer');
  };

  const setBookingToken = (token: string) => {
    if (customer) {
      const updated = { ...customer, bookingToken: token };
      setCustomer(updated);
      localStorage.setItem('customer', JSON.stringify(updated));
    }
  };

  return (
    <CustomerAuthContext.Provider value={{ customer, loginWithGoogle, logout, setBookingToken }}>
      {children}
    </CustomerAuthContext.Provider>
  );
};

export const useCustomerAuth = () => {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error('useCustomerAuth must be used within CustomerAuthProvider');
  }
  return context;
};
