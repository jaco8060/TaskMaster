// src/components/App.js

import "bootstrap/dist/css/bootstrap.min.css";

import "./styles/App.scss";

import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import User from "./components/User";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<PrivateRoute />}>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/user/:id" element={<User />} />
      </Route>
    </Routes>
  );
};

export default App;
