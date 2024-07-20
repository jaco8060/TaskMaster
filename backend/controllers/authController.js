import bcrypt from "bcrypt";
import {
  forgotPassword,
  resetPassword,
} from "../controllers/forgotAuthController.js";
import {
  createUser,
  findUserById,
  findUserByUsername,
} from "../models/authModel.js";
import passport from "../passport-config.js";

export const handleRegister = async (req, res) => {
  const { username, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await createUser(username, email, hashedPassword, role);
    res.json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const handleLogin = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      res.json(req.user);
    });
  })(req, res, next);
};

export const handleLogout = (req, res, next) => {
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
};

export const handleGetUser = (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
};

export const handleForgotPassword = forgotPassword;
export const handleResetPassword = resetPassword;
