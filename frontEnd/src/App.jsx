// src/components/App.js

import "bootstrap/dist/css/bootstrap.min.css";

import "./styles/App.scss";

import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "./components/Dashboard";
import LoginPage from "./components/LoginPage";
import ResetPassword from "./components/ResetPassword";

import User from "./components/User";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/" element={<PrivateRoute />}>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/user/:id" element={<User />} />
      </Route>
    </Routes>
  );
};

export default App;
