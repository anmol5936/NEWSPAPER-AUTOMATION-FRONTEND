import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api, { LoginCredentials, LoginResponse } from '../services/api';

interface AuthContextType {
  user: LoginResponse | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: LoginCredentials & { role: 'manager' | 'deliverer' }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LoginResponse | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('username'); // Clear additional items
      localStorage.removeItem('role');
      localStorage.removeItem('userId');
    }
  }, [user]);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    const response = await api.login(credentials);
    setUser(response);
  };

  const register = async (credentials: LoginCredentials & { role: 'manager' | 'deliverer' }): Promise<void> => {
    const response = await api.register(credentials);
    setUser(response);
  };

  const logout = (): void => {
    setUser(null); // This will trigger the useEffect to clear localStorage
  };

  const providerValue: AuthContextType = { user, login, register, logout };

  return (
    <AuthContext.Provider value={providerValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}