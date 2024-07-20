import express from "express";
import {
  handleAssignRoles,
  handleGetUsers,
} from "../controllers/userController.js";
import { ensureAuthenticated } from "../middleware/authMiddleware.js";

const userRouter = express.Router();

// Define the route to get users
userRouter.get("/", ensureAuthenticated, handleGetUsers);

// Route to assign user roles
userRouter.post("/assign-role", ensureAuthenticated, handleAssignRoles);

export default userRouter;
