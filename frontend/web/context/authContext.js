import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import axios from 'axios';

const AuthContext = createContext();

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const AuthProvider = ({ children, initialUser }) => {
  const [user, setUser] = useState(initialUser || null);
  const [loading, setLoading] = useState(!initialUser);
  const router = useRouter();

  useEffect(() => {
  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/auth/me`, {
        withCredentials: true, // sends the cookie automatically
      });
      setUser(res.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  fetchUser();
}, []);


  const login = async (data) => {
    try {
      const res = await axios.post(`${API_BASE}/api/auth/login`, data, {
        withCredentials: true,
      });
      setUser(res.data.user);
      router.push('/'); // redirect to main feed after login
      return res.data.user;
    } catch (err) {
      throw err.response?.data?.error || 'Login failed';
    }
  };

  const signup = async (data) => {
    try {
      const res = await axios.post(`${API_BASE}/api/auth/signup`, data, {
        withCredentials: true,
      });
      setUser(res.data.user);
      router.push('/');
      return res.data.user;
    } catch (err) {
      throw err.response?.data?.error || 'Signup failed';
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_BASE}/api/auth/logout`, {}, { withCredentials: true });
      setUser(null);
      router.push('/');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const updateProfile = async (data) => {
    try {
      const res = await axios.patch(`${API_BASE}/api/auth/me`, data, { withCredentials: true });
      setUser(res.data.user);
      return res.data.user;
    } catch (err) {
      throw err.response?.data?.error || 'Update failed';
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
  initialUser: PropTypes.object,
};
export const useAuth = () => useContext(AuthContext);
