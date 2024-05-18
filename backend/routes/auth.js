import bcrypt from "bcrypt";
import express from "express";
import session from "express-session";
import { pool } from "../database.js";
import passport from "../passport-config.js";

const authRouter = express.Router();

// Middleware for session and passport
authRouter.use(
  session({
    secret: "your_secret_key", // Used to sign the session ID cookie
    resave: false, // Prevents saving session if it wasn't modified
    saveUninitialized: false, // Prevents saving uninitialized session
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    },
  })
);
authRouter.use(passport.initialize());
authRouter.use(passport.session());

// Registration Route
authRouter.post("/register", async (req, res) => {
  const { username, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const result = await pool.query(
      "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
      [username, email, hashedPassword, role]
    );
    res.json(result.rows[0]);
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
authRouter.get("/logout", (req, res) => {
  req.logout();
  res.json({ message: "Logged out" });
});

// Get User Route
authRouter.get("/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
});

export default authRouter;
