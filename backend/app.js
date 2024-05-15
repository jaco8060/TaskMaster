import cors from "cors";
import express from "express";
import { createUser, getUser, getUsers } from "./database.js";

const app = express();
app.use(cors());

// app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  const users = await getUsers();
  return res.json(users);
});

import userRouter from "./routes/users.js";
app.use("/users", userRouter);

app.listen(8081);
