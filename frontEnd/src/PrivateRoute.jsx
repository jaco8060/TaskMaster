import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "./contexts/AuthProvider";

// Check if the user is authenticated from global state AuthContext
const PrivateRoute = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    // Optionally show a loading indicator while checking authentication
    return <div>Loading...</div>;
  }

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
