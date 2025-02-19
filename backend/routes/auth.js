import express from "express";
import {
  handleCheckUsername,
  handleForgotPassword,
  handleGetUser,
  handleLogin,
  handleLogout,
  handleRegister,
  handleResetPassword,
  handleCheckEmail,
} from "../controllers/authController.js";

const authRouter = express.Router();

// Registration Route
authRouter.post("/register", handleRegister);

// Login Route
authRouter.post("/login", handleLogin);

// Logout Route
authRouter.get("/logout", handleLogout);

// Get User Route
authRouter.get("/user", handleGetUser);

// to check if a username exists
authRouter.get("/check-username", handleCheckUsername);

// Password Reset Routes
authRouter.post("/forgot-password", handleForgotPassword);
authRouter.post("/reset-password", handleResetPassword);

// Check Email Route
authRouter.get("/check-email", handleCheckEmail);

export default authRouter;
