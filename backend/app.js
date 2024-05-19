import cors from "cors";
import express from "express";
import session from "express-session";
import passport from "./passport-config.js"; // Ensure this points to your passport configuration
import authRouter from "./routes/auth.js";
import userRouter from "./routes/users.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // Adjust this to your frontend URL
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(
  session({
    name: "my_session_cookie",
    secret: "secret_key123", // Replace with your secret
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set to true if using HTTPS
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      path: "/",
    },
  })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Add routes
app.use("/auth", authRouter);
app.use("/users", userRouter);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
