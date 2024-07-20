// src/components/App.js

import "bootstrap/dist/css/bootstrap.min.css";

import React from "react";
import ThemeProvider from "react-bootstrap/ThemeProvider";
import { Navigate, Route, Routes } from "react-router-dom";

import "./color-theme.scss";

import Dashboard from "./components/dashboard/Dashboard";
import ManageProjectUsers from "./components/dashboard/manage project users/ManageProjectUsers";
import ManageRoles from "./components/dashboard/manage roles/ManageRoles";
import LoginPage from "./components/login/LoginPage";
import ResetPassword from "./components/login/ResetPassword";
import MyProjects from "./components/myprojects/MyProjects";
import AdminRoute from "./components/routes/AdminRoute";
import PMRoute from "./components/routes/PMRoute";
import PrivateRoute from "./components/routes/PrivateRoute";
import PublicRoute from "./components/routes/PublicRoute";
import "./styles/App.scss";
const App = () => {
  return (
    <Routes>
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      {/* redirect to dashboard if on login and session is active */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>
      {/* redirect to login if session is not active */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/myprojects" element={<MyProjects />} />
      </Route>
      <Route element={<AdminRoute />}>
        <Route path="/manage-roles" element={<ManageRoles />} />
      </Route>
      <Route element={<PMRoute />}>
        <Route path="/manage-project-users" element={<ManageProjectUsers />} />
      </Route>
    </Routes>
  );
};

export default App;
