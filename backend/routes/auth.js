import express from "express";
import {
  handleForgotPassword,
  handleGetUser,
  handleLogin,
  handleLogout,
  handleRegister,
  handleResetPassword,
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

// Password Reset Routes
authRouter.post("/forgot-password", handleForgotPassword);
authRouter.post("/reset-password", handleResetPassword);

export default authRouter;
