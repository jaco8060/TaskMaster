// app.js

import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import { pool } from "./database.js";
import passport from "./passport-config.js";
import authRouter from "./routes/auth.js";
import notificationRouter from "./routes/notifications.js";
import projectRouter from "./routes/projects.js";
import ticketRouter from "./routes/tickets.js";
import userRouter from "./routes/users.js";
import seedUsers from "./seed.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    name: "my_session_cookie",
    secret: "secret_key123",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    },
  })
);

app.use("/uploads", express.static("uploads"));

app.use(passport.initialize());
app.use(passport.session());

// Add routes
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/projects", projectRouter);
app.use("/tickets", ticketRouter);
app.use("/notifications", notificationRouter);

// Function to start the server after database is ready
const startServer = async () => {
  try {
    // Test database connection
    await pool.query("SELECT NOW()");
    console.log("Database connected successfully.");

    // Seed users if not in production
    if (process.env.NODE_ENV !== "production") {
      await seedUsers();
    }

    // Start the server
    app.listen(process.env.PORT || 5000, () => {
      console.log("Server is running on port 5000");
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    setTimeout(startServer, 5000); // Retry after 5 seconds
  }
};

startServer();
