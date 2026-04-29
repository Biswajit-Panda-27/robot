import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  name: string;
  email: string;
  password?: string; // Stored for mock validation
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => { success: boolean; message: string };
  register: (name: string, email: string, password: string) => { success: boolean; message: string };
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);

  useEffect(() => {
    // Load current session
    const savedUser = localStorage.getItem('robot-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Load registered users database
    const savedUsers = localStorage.getItem('robot-users-db');
    if (savedUsers) {
      setRegisteredUsers(JSON.parse(savedUsers));
    }
  }, []);

  const register = (name: string, email: string, password: string) => {
    if (registeredUsers.some(u => u.email === email)) {
      return { success: false, message: "User already exists with this email." };
    }

    const newUser = { name, email, password };
    const updatedUsers = [...registeredUsers, newUser];
    setRegisteredUsers(updatedUsers);
    localStorage.setItem('robot-users-db', JSON.stringify(updatedUsers));
    
    return { success: true, message: "Registration successful! Please login." };
  };

  const login = (email: string, password: string) => {
    const foundUser = registeredUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const sessionUser = { name: foundUser.name, email: foundUser.email };
      setUser(sessionUser);
      localStorage.setItem('robot-user', JSON.stringify(sessionUser));
      return { success: true, message: "Login successful!" };
    }
    
    return { success: false, message: "Invalid email or password." };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('robot-user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
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
