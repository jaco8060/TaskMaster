// AuthProvider.tsx
import axios from "axios";
import React, { createContext, ReactNode, useEffect, useState } from "react";

export interface User {
  id: number;
  role: "admin" | "pm" | "submitter" | "developer";
  username: string;
  email: string;
  profile_picture?: string;
  organization_id?: number;
  organization_name?: string; // Added to allow display in the UI
  first_name?: string;
  last_name?: string;
  bio?: string;
}

export interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
}
// Create the context with an initial value of undefined
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_URL}/auth/user`,
          { withCredentials: true }
        );
        setUser(response.data);
      } catch (error) {
        console.error("Auth check error:", error);
        // Clear active tab from local storage
        localStorage.removeItem("activeTab");
        setUser(null);
      } finally {
        setLoading(false);
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
