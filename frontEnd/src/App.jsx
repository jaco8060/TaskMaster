// src/components/App.js

import "bootstrap/dist/css/bootstrap.min.css";

import React from "react";
import ThemeProvider from "react-bootstrap/ThemeProvider";
import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./components/dashboard/Dashboard";
import LoginPage from "./components/login/LoginPage";
import ResetPassword from "./components/login/ResetPassword";
import PrivateRoute from "./components/routes/PrivateRoute";
import PublicRoute from "./components/routes/PublicRoute";
import "./styles/App.scss";

import User from "./components/User";

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
        <Route path="/dashboard/user/:id" element={<User />} />
      </Route>
    </Routes>
  );
};

export default App;
