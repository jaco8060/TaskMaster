// frontEnd/src/App.tsx
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import "./color-theme.scss";
import Dashboard from "./components/dashboard/Dashboard";
import ManageRoles from "./components/dashboard/manage roles/ManageRoles";
import AssignPersonnel from "./components/dashboard/myprojects/AssignPersonnel";
import MyProjects from "./components/dashboard/myprojects/MyProjects";
import ProjectDetails from "./components/dashboard/myprojects/ProjectDetails";
import MyTickets from "./components/dashboard/tickets/MyTickets";
import TicketDetails from "./components/dashboard/tickets/TicketDetails";
import UserProfile from "./components/dashboard/UserProfile"; // <-- Import the new profile page
import LoginPage from "./components/login/LoginPage";
import ResetPassword from "./components/login/ResetPassword";
import AdminRoute from "./components/routes/AdminRoute";
import PrivateRoute from "./components/routes/PrivateRoute";
import PublicRoute from "./components/routes/PublicRoute";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      {/* Public routes */}
      {/* Redirect to dashboard if on login and session is active */}
      <Route element={<PublicRoute />}>
        <Route path="/login/*" element={<LoginPage />} />
      </Route>
      {/* Private routes */}
      {/* Redirect to login if session is not active */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/myprojects" element={<MyProjects />} />
        <Route path="/project-details/:id" element={<ProjectDetails />} />
        <Route path="/assign-personnel/:id" element={<AssignPersonnel />} />
        <Route path="/mytickets" element={<MyTickets />} />
        <Route path="/ticket-details/:id" element={<TicketDetails />} />
        <Route path="/userprofile" element={<UserProfile />} />{" "}
      </Route>
      <Route element={<AdminRoute />}>
        <Route path="/manage-roles" element={<ManageRoles />} />
      </Route>
    </Routes>
  );
};

export default App;
