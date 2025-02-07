import axios from "axios";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

// Define the types for the user and context
interface User {
  id: number;
  role: string;
  username: string;
  email: string;
  profile_picture?: string;
}

// Define the context type
export interface AuthContextType {
  // Make sure to export the type here
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
}

// Create the context with an initial value of undefined
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// Define the props for the AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

// Provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Add loading state

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_URL}/auth/user`,
          {
            withCredentials: true,
          }
        );

        setUser(response.data);
      } catch (error) {
        console.log(error);
        // Clear active tab from local storage
        localStorage.removeItem("activeTab");
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
