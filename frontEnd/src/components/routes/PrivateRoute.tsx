import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext, AuthContextType } from "../../contexts/AuthProvider"; // Import the context and type

// Check if the user is authenticated from global state AuthContext
const PrivateRoute: React.FC = () => {
  const { user, loading } = useContext(AuthContext) as AuthContextType; // Cast context to correct type

  if (loading) {
    // Optionally show a loading indicator while checking authentication
    return <div>Loading...</div>;
  }

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
