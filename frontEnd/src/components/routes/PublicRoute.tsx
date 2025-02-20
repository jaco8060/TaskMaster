import React, { useContext } from "react";
import { Container, Spinner } from "react-bootstrap";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext, AuthContextType } from "../../contexts/AuthProvider"; // Import the correct type
const PublicRoute: React.FC = () => {
  const { user, loading } = useContext(AuthContext) as AuthContextType; // Cast context to the correct type

  <Container className="mt-5 text-center">
    <Spinner animation="border" variant="primary" />
  </Container>;

  return user ? <Navigate to="/dashboard" /> : <Outlet />;
};

export default PublicRoute;
