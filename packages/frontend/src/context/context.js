"use client"
import { createContext, useContext, useState } from 'react';

// Create the context
const AppContext = createContext();

// Create a provider component
export function AppProvider({ children }) {
  const [user, setUser] = useState(null);  // Example state: user authentication data

  const login = (userData) => {
    setUser(userData);  // Set user data when logging in
  };

  const logout = () => {
    setUser(null);  // Remove user data when logging out
  };

  return (
    <AppContext.Provider value={{ user, login, logout }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the context in any component
export const useAppContext = () => {
  return useContext(AppContext);
};
