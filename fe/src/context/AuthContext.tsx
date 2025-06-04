import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

// Define the User type
export interface User {
  id: string;
  email: string;
  displayName?: string;
}

// Define the AuthContextType interface
export interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password?: string) => Promise<void>; // password optional for mock
  logout: () => Promise<void>;
  register: (email: string, password?: string) => Promise<void>; // password optional for mock
  loading: boolean;
}

// Create the AuthContext
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the useAuth hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Define Props for AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

// Create the AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Initially true to check localStorage
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Check localStorage for a persisted user on mount
    try {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to parse user from localStorage:', error);
      localStorage.removeItem('currentUser'); // Clear corrupted item
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password?: string): Promise<void> => {
    setLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser: User = { id: '1', email, displayName: 'Mock User' };
        setCurrentUser(mockUser);
        localStorage.setItem('currentUser', JSON.stringify(mockUser));
        setLoading(false);
        resolve();
      }, 1000);
    });
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    // Using await for the promise to ensure navigation happens after state updates if needed,
    // though for mock timeout it's mostly sequencing.
    await new Promise(resolve => setTimeout(resolve, 500));
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setLoading(false);
    navigate('/'); // Navigate to home page after logout
    // No explicit resolve() needed if the promise just completes.
    // If we were in a promise constructor, we'd call resolve.
    // Since this is an async function, it implicitly returns a resolved promise.
  };

  const register = async (email: string, password?: string): Promise<void> => {
    setLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        // For simplicity, register behaves like login for now
        const mockUser: User = { id: '2', email, displayName: 'New User' }; // Different ID for register
        setCurrentUser(mockUser);
        localStorage.setItem('currentUser', JSON.stringify(mockUser));
        setLoading(false);
        resolve();
      }, 1000);
    });
  };

  const value = {
    currentUser,
    login,
    logout,
    register,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
