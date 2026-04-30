import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface Address {
  country: string;
  state: string;
  landmark: string;
  pincode: string;
  fullAddress: string;
}

interface User {
  name: string;
  email: string;
  password?: string;
  address?: Address;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => { success: boolean; message: string };
  register: (name: string, email: string, password: string) => { success: boolean; message: string };
  updateAddress: (address: Address) => void;
  googleLogin: (token: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('robot-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

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
      setUser(foundUser);
      localStorage.setItem('robot-user', JSON.stringify(foundUser));
      return { success: true, message: "Login successful!" };
    }
    return { success: false, message: "Invalid email or password." };
  };

  const updateAddress = (address: Address) => {
    if (!user) return;
    const updatedUser = { ...user, address };
    setUser(updatedUser);
    localStorage.setItem('robot-user', JSON.stringify(updatedUser));

    const updatedDB = registeredUsers.map(u => u.email === user.email ? updatedUser : u);
    setRegisteredUsers(updatedDB);
    localStorage.setItem('robot-users-db', JSON.stringify(updatedDB));
  };

  const googleLogin = async (token: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });

      const data = await response.json();

      if (response.ok) {
        const loggedUser = {
          name: data.user.name,
          email: data.user.email,
          token: data.access_token
        };
        setUser(loggedUser);
        localStorage.setItem('robot-user', JSON.stringify(loggedUser));
        return { success: true, message: "Google login successful!" };
      } else {
        return { success: false, message: data.detail || "Google login failed." };
      }
    } catch (error) {
      console.error("Google login error:", error);
      return { success: false, message: "Connection error. Please try again." };
    }
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem('robot-user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, googleLogin, updateAddress, logout, isAuthenticated: !!user }}>
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
