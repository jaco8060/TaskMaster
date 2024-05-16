import cors from "cors";
import express from "express";

const app = express();
app.use(cors());

import userRouter from "./routes/users.js";
app.use("/users", userRouter);

app.listen(5000);
