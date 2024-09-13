import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext, AuthContextType } from "../../contexts/AuthProvider"; // Import the correct type

const PublicRoute: React.FC = () => {
  const { user, loading } = useContext(AuthContext) as AuthContextType; // Cast context to the correct type

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? <Navigate to="/dashboard" /> : <Outlet />;
};

export default PublicRoute;
