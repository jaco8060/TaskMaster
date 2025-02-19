import { useContext } from "react";
import { Toast } from "react-bootstrap";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext, AuthContextType } from "../../contexts/AuthProvider"; // Make sure AuthContextType is imported

const AdminRoute: React.FC = () => {
  const { user, loading } = useContext(AuthContext) as AuthContextType; // Cast the context with proper type

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user && user.role === "admin") {
    return <Outlet />;
  } else {
    return (
      <>
        <Toast
          show={true}
          delay={3000}
          autohide
          bg="danger"
          className="position-fixed top-0 start-50 translate-middle-x mt-3"
        >
          <Toast.Body className="text-white">Permission denied</Toast.Body>
        </Toast>
        <Navigate to="/dashboard" />
      </>
    );
  }
};

export default AdminRoute;
