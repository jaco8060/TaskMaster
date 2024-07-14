import bcrypt from "bcrypt";
import express from "express";
import {
  forgotPassword,
  resetPassword,
} from "../controllers/forgotAuthController.js";
import { createUser } from "../models/authModel.js";
import passport from "../passport-config.js";

const authRouter = express.Router();

// Registration Route
authRouter.post("/register", async (req, res) => {
  const { username, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await createUser(username, email, hashedPassword, role);
    res.json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Login Route
authRouter.post("/login", passport.authenticate("local"), (req, res) => {
  res.json(req.user);
});

// Logout Route
authRouter.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to destroy session" });
      }
      res.clearCookie("my_session_cookie"); // Ensure this matches the name of your session cookie
      res.json({ message: "Logged out" });
    });
  });
});

// Get User Route
authRouter.get("/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
});

authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);

export default authRouter;
