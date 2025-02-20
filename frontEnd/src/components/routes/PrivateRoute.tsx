import { useContext } from "react";
import { Container, Spinner } from "react-bootstrap";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext, AuthContextType } from "../../contexts/AuthProvider"; // Import the context and type
// Check if the user is authenticated from global state AuthContext
const PrivateRoute: React.FC = () => {
  const { user, loading } = useContext(AuthContext) as AuthContextType; // Cast context to correct type

  if (loading) {
    <Container className="mt-5 text-center">
      <Spinner animation="border" variant="primary" />
    </Container>;
  }

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
