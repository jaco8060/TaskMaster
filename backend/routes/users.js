import express from "express";
import { createUser, getUser, getUsers } from "../database.js";
const userRouter = express.Router();
userRouter.get("/users", async (req, res) => {
  const users = await getUsers();
  res.json(users);
});

// userRouter.post("/", (req, res) => {
//   res.send("Create user");
// });

// userRouter
//   .route("/:id")
//   .get((req, res) => {
//     console.log(req.user);
//     res.send(`Get user with id ${req.params.id}`);
//   })
//   .put((req, res) => {
//     res.send(`Update user with id ${req.params.id}`);
//   })
//   .delete((req, res) => {
//     res.send(`Delete user with id ${req.params.id}`);
//   });

// const users = [{ name: "kyle" }, { name: "Sally" }];
// userRouter.param("id", (req, res, next, id) => {
//   req.user = users[id];
//   next();
// });

export default userRouter;
