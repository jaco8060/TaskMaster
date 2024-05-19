import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";

// Create the context
export const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_URL}/auth/user`,
          {
            withCredentials: true,
          }
        );
        console.log(response.data);
        setUser(response.data);
      } catch (error) {
        console.log(error);
        setUser(null);
      } finally {
        setLoading(false); // Set loading to false after the check
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
