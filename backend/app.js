import cors from "cors";
import express from "express";

const app = express();
app.use(cors());
app.use(express.json());

// add users route
import userRouter from "./routes/users.js";
app.use("/users", userRouter);

app.listen(5000);
