import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('shopvibe_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('shopvibe_user');
      }
    }
    setLoading(false);
  }, []);

  // Register user
  const register = async (name, email, password) => {
    const res = await fetch(`${API_URL}/api/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    // Store user with email (backend doesn't return email in register, so we add it)
    const userData = { ...data, email };
    setUser(userData);
    localStorage.setItem('shopvibe_user', JSON.stringify(userData));
    return userData;
  };

  // Login user
  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Login failed');
    }

    const userData = { ...data, email };
    setUser(userData);
    localStorage.setItem('shopvibe_user', JSON.stringify(userData));
    return userData;
  };

  // Update user profile
  const updateProfile = async (updates) => {
    const res = await fetch(`/api/users/${user._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(updates),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Update failed');
    }

    // Merge updates with existing user (keep token)
    const updatedUser = { ...user, ...data, token: user.token };
    setUser(updatedUser);
    localStorage.setItem('shopvibe_user', JSON.stringify(updatedUser));
    return updatedUser;
  };

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('shopvibe_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      register,
      login,
      logout,
      updateProfile,
      isAuthenticated: !!user,
    }}>
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
