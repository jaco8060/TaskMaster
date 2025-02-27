// frontEnd/src/App.tsx
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Spinner, ToastContainer } from "react-bootstrap";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import "./color-theme.scss";
import Dashboard from "./components/dashboard/Dashboard";
import ManageRoles from "./components/dashboard/manage roles/ManageRoles";
import MyOrganization from "./components/dashboard/MyOrganization"; // New organization management page
import AssignPersonnel from "./components/dashboard/myprojects/AssignPersonnel";
import MyProjects from "./components/dashboard/myprojects/MyProjects";
import ProjectDetails from "./components/dashboard/myprojects/ProjectDetails";
import OrganizationStatus from "./components/dashboard/OrganizationStatus";
import MyTickets from "./components/dashboard/tickets/MyTickets";
import TicketDetails from "./components/dashboard/tickets/TicketDetails";
import UserProfile from "./components/dashboard/UserProfile";
import LoginPage from "./components/login/LoginPage";
import RegisterWithOrganization from "./components/login/RegisterWithOrganization"; // New registration flow
import ResetPassword from "./components/login/ResetPassword";
import AdminRoute from "./components/routes/AdminRoute";
import PrivateRoute from "./components/routes/PrivateRoute";
import PublicRoute from "./components/routes/PublicRoute";
import { AuthContext, AuthContextType } from "./contexts/AuthProvider";

const App: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        {/* Public routes */}
        {/* Redirect to dashboard if on login and session is active */}
        <Route element={<PublicRoute />}>
          <Route path="/login/*" element={<LoginPage />} />
          <Route path="/register" element={<RegisterWithOrganization />} />
        </Route>
        {/* Private routes */}
        {/* Redirect to login if session is not active */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route
            path="/dashboard"
            element={
              <OrganizationStatusWrapper>
                <Dashboard />
              </OrganizationStatusWrapper>
            }
          />
          <Route path="/myprojects" element={<MyProjects />} />
          <Route path="/project-details/:id" element={<ProjectDetails />} />
          <Route path="/assign-personnel/:id" element={<AssignPersonnel />} />
          <Route path="/mytickets" element={<MyTickets />} />
          <Route path="/ticket-details/:id" element={<TicketDetails />} />
          <Route path="/userprofile" element={<UserProfile />} />
          <Route path="/myorganization" element={<MyOrganization />} />
        </Route>
        <Route element={<AdminRoute />}>
          <Route path="/manage-roles" element={<ManageRoles />} />
        </Route>
      </Routes>
      <ToastContainer
        position="top-center"
        className="p-3"
        style={{ top: "20px" }}
      />
    </>
  );
};

const OrganizationStatusWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useContext(AuthContext) as AuthContextType;
  const [orgStatus, setOrgStatus] = useState<
    "approved" | "pending" | "rejected" | "none"
  >("none");
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_URL}/organizations/status`,
          {
            withCredentials: true,
          }
        );
        setOrgStatus(response.data.status);
      } catch (error) {
        console.error("Error checking organization status:", error);
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, [user?.id, location.key]);

  if (loading) return <Spinner animation="border" />;
  if (orgStatus !== "approved")
    return <OrganizationStatus userId={user?.id || 0} />;
  return <>{children}</>;
};

export default App;
