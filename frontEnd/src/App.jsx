// src/components/App.js

import "bootstrap/dist/css/bootstrap.min.css";

import ThemeProvider from "react-bootstrap/ThemeProvider";
import "./styles/App.scss";

import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import LoginPage from "./components/LoginPage";
import ResetPassword from "./components/ResetPassword";
import PrivateRoute from "./components/routes/PrivateRoute";
import PublicRoute from "./components/routes/PublicRoute";

import User from "./components/User";

const App = () => {
  return (
    <Routes>
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/user/:id" element={<User />} />
      </Route>
    </Routes>
  );
};

export default App;
