import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext, AuthContextType } from "../../contexts/AuthProvider"; // Ensure AuthContextType is imported

const PMRoute: React.FC = () => {
  const { user, loading } = useContext(AuthContext) as AuthContextType; // Cast the context with proper type

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user && (user.role === "pm" || user.role === "admin")) {
    return <Outlet />;
  } else {
    alert("Permission is not allowed");
    return <Navigate to="/dashboard" />;
  }
};

export default PMRoute;
