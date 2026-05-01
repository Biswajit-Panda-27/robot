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
  token?: string;
  role?: string;
  address?: Address;
}

interface AuthContextType {
  user: User | null;
  register: (name: string, email: string) => Promise<{ success: boolean; message: string }>;
  setPassword: (token: string, password: string) => Promise<{ success: boolean; message: string }>;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string; requiresOTP?: boolean }>;
  verifyOTP: (email: string, otp: string) => Promise<{ success: boolean; message: string }>;
  googleLogin: (token: string) => Promise<{ success: boolean; message: string }>;
  updateAddress: (address: Address) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('robot-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const apiFetch = async (endpoint: string, body: any) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return response;
  };

  const register = async (name: string, email: string) => {
    try {
      const res = await apiFetch('/auth/register', { name, email });
      const data = await res.json();
      return { success: res.ok, message: data.message || data.detail };
    } catch (err) {
      return { success: false, message: "Connection error." };
    }
  };

  const setPassword = async (token: string, password: string) => {
    try {
      const res = await apiFetch('/auth/set-password', { token, password });
      const data = await res.json();
      return { success: res.ok, message: data.message || data.detail };
    } catch (err) {
      return { success: false, message: "Connection error." };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await apiFetch('/auth/login', { email, password });
      const data = await res.json();
      if (res.ok) {
        return { success: true, message: data.message, requiresOTP: true };
      }
      return { success: false, message: data.detail || "Login failed." };
    } catch (err) {
      return { success: false, message: "Connection error." };
    }
  };

  const verifyOTP = async (email: string, otp: string) => {
    try {
      const res = await apiFetch('/auth/verify-otp', { email, otp });
      const data = await res.json();
      if (res.ok) {
        const loggedUser = {
          name: data.user.name,
          email: data.user.email,
          token: data.access_token,
          role: data.user.role
        };
        setUser(loggedUser);
        localStorage.setItem('robot-user', JSON.stringify(loggedUser));
        return { success: true, message: "Welcome back!" };
      }
      return { success: false, message: data.detail || "Invalid OTP." };
    } catch (err) {
      return { success: false, message: "Connection error." };
    }
  };

  const googleLogin = async (token: string) => {
    try {
      const res = await apiFetch('/auth/google', { token });
      const data = await res.json();
      if (res.ok) {
        const loggedUser = {
          name: data.user.name,
          email: data.user.email,
          token: data.access_token,
          role: data.user.role
        };
        setUser(loggedUser);
        localStorage.setItem('robot-user', JSON.stringify(loggedUser));
        return { success: true, message: "Google login successful!" };
      }
      return { success: false, message: data.detail || "Google login failed." };
    } catch (err) {
      return { success: false, message: "Connection error." };
    }
  };

  const updateAddress = (address: Address) => {
    if (!user) return;
    const updatedUser = { ...user, address };
    setUser(updatedUser);
    localStorage.setItem('robot-user', JSON.stringify(updatedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('robot-user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, register, setPassword, login, verifyOTP, googleLogin, 
      updateAddress, logout, isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
