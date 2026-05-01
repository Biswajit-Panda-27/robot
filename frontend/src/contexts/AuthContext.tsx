import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface Address {
  id: string;
  label?: string;
  state: string;
  city: string;
  landmark: string;
  pincode: string;
  is_default: boolean;
}

interface User {
  name: string;
  email: string;
  mobile?: string;
  secondary_mobile?: string;
  token?: string;
  role?: string;
  addresses: Address[];
  created_at?: string;
}

interface AuthContextType {
  user: User | null;
  register: (name: string, email: string) => Promise<{ success: boolean; message: string }>;
  setPassword: (token: string, password: string) => Promise<{ success: boolean; message: string }>;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string; requiresOTP?: boolean }>;
  verifyOTP: (email: string, otp: string) => Promise<{ success: boolean; message: string }>;
  googleLogin: (token: string) => Promise<{ success: boolean; message: string }>;
  fetchMe: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; message: string }>;
  addAddress: (data: Omit<Address, 'id'>) => Promise<{ success: boolean; message: string }>;
  updateAddress: (addressId: string, data: Partial<Address>) => Promise<{ success: boolean; message: string }>;
  deleteAddress: (addressId: string) => Promise<{ success: boolean; message: string }>;
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
      setTimeout(() => fetchMe(), 100);
    }
  }, []);

  const authFetch = async (endpoint: string, method: string = 'GET', body?: any) => {
    const stored = JSON.parse(localStorage.getItem('robot-user') || '{}');
    const token = user?.token || stored.token;
    
    const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
      method,
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: body ? JSON.stringify(body) : undefined
    });
    return response;
  };

  const register = async (name: string, email: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email })
      });
      const data = await res.json();
      return { success: res.ok, message: data.message || data.detail };
    } catch (err) {
      return { success: false, message: "Connection error." };
    }
  };

  const setPassword = async (token: string, password: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/set-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });
      const data = await res.json();
      return { success: res.ok, message: data.message || data.detail };
    } catch (err) {
      return { success: false, message: "Connection error." };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      if (res.ok) {
        const loggedUser = {
          ...data.user,
          token: data.access_token,
          addresses: data.user.addresses || []
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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      const data = await res.json();
      if (res.ok) {
        const loggedUser = {
          ...data.user,
          token: data.access_token,
          addresses: data.user.addresses || []
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

  const fetchMe = async () => {
    const stored = JSON.parse(localStorage.getItem('robot-user') || '{}');
    const token = user?.token || stored.token;
    if (!token) return;

    try {
      const res = await authFetch('/user/me');
      if (res.ok) {
        const data = await res.json();
        const currentUser = { ...data, token };
        setUser(currentUser);
        localStorage.setItem('robot-user', JSON.stringify(currentUser));
      }
    } catch (err) {
      console.error("Failed to sync user profile", err);
    }
  };

  const updateProfile = async (updateData: Partial<User>) => {
    const stored = JSON.parse(localStorage.getItem('robot-user') || '{}');
    const token = user?.token || stored.token;
    try {
      const res = await authFetch('/user/update', 'PATCH', updateData);
      const data = await res.json();
      if (res.ok) {
        const updatedUser = { ...data, token };
        setUser(updatedUser);
        localStorage.setItem('robot-user', JSON.stringify(updatedUser));
        return { success: true, message: "Profile updated!" };
      }
      return { success: false, message: data.detail || "Update failed." };
    } catch (err) {
      return { success: false, message: "Connection error." };
    }
  };

  const addAddress = async (addressData: Omit<Address, 'id'>) => {
    const stored = JSON.parse(localStorage.getItem('robot-user') || '{}');
    const token = user?.token || stored.token;
    try {
      const res = await authFetch('/user/address', 'POST', addressData);
      const data = await res.json();
      if (res.ok) {
        const updatedUser = { ...data, token };
        setUser(updatedUser);
        localStorage.setItem('robot-user', JSON.stringify(updatedUser));
        return { success: true, message: "Address added!" };
      }
      return { success: false, message: data.detail || "Failed to add." };
    } catch (err) {
      return { success: false, message: "Connection error." };
    }
  };

  const updateAddress = async (addressId: string, addressData: Partial<Address>) => {
    const stored = JSON.parse(localStorage.getItem('robot-user') || '{}');
    const token = user?.token || stored.token;
    try {
      const res = await authFetch(`/user/address/${addressId}`, 'PATCH', addressData);
      const data = await res.json();
      if (res.ok) {
        const updatedUser = { ...data, token };
        setUser(updatedUser);
        localStorage.setItem('robot-user', JSON.stringify(updatedUser));
        return { success: true, message: "Address updated!" };
      }
      return { success: false, message: data.detail || "Failed to update." };
    } catch (err) {
      return { success: false, message: "Connection error." };
    }
  };

  const deleteAddress = async (addressId: string) => {
    const stored = JSON.parse(localStorage.getItem('robot-user') || '{}');
    const token = user?.token || stored.token;
    try {
      const res = await authFetch(`/user/address/${addressId}`, 'DELETE');
      const data = await res.json();
      if (res.ok) {
        const updatedUser = { ...data, token };
        setUser(updatedUser);
        localStorage.setItem('robot-user', JSON.stringify(updatedUser));
        return { success: true, message: "Address deleted!" };
      }
      return { success: false, message: data.detail || "Failed to delete." };
    } catch (err) {
      return { success: false, message: "Connection error." };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('robot-user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, register, setPassword, login, verifyOTP, googleLogin, 
      fetchMe, updateProfile, addAddress, updateAddress, deleteAddress, logout, isAuthenticated: !!user 
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
