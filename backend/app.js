import cors from "cors";
import express from "express";
import authRouter from "./routes/auth.js";

const app = express();

app.use(cors());
app.use(express.json());
// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// add auth route
app.use("/auth", authRouter);

app.listen(5000);
