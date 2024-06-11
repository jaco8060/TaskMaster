import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthProvider";

const AdminRoute = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user && user.role === "admin") {
    return <Outlet />;
  } else {
    alert("Permission is not allowed");
    return <Navigate to="/dashboard" />;
  }
};

export default AdminRoute;
