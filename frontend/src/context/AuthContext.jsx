import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('vegetable-mart-current-user') || sessionStorage.getItem('vegetable-mart-current-user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [currentRider, setCurrentRider] = useState(() => {
    try {
      const saved = localStorage.getItem('vegetable-mart-rider-session');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const loginUser = (user, remember = true) => {
    setCurrentUser(user);
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem('vegetable-mart-current-user', JSON.stringify(user));
    if (user.token) {
      storage.setItem('vegetable-mart-token', user.token);
    }
  };

  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem('vegetable-mart-current-user');
    sessionStorage.removeItem('vegetable-mart-current-user');
    localStorage.removeItem('vegetable-mart-token');
    sessionStorage.removeItem('vegetable-mart-token');
  };

  const loginRider = (rider) => {
    setCurrentRider(rider);
    localStorage.setItem('vegetable-mart-rider-session', JSON.stringify(rider));
    if (rider.token) {
      localStorage.setItem('vegetable-mart-rider-token', rider.token);
    }
  };

  const logoutRider = () => {
    setCurrentRider(null);
    localStorage.removeItem('vegetable-mart-rider-session');
    localStorage.removeItem('vegetable-mart-rider-token');
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      currentRider,
      loginUser,
      logoutUser,
      loginRider,
      logoutRider,
      isAdmin: currentUser?.role === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

