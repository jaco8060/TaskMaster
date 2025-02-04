import express from "express";
import {
  handleAssignRoles,
  handleGetUsers,
  handleRemoveRoleAssignment, // Import the new handler
} from "../controllers/userController.js";
import { ensureAuthenticated } from "../middleware/authMiddleware.js";

const userRouter = express.Router();

// Define the route to get users
userRouter.get("/", ensureAuthenticated, handleGetUsers);

// Route to assign user roles
userRouter.post("/assign-role", ensureAuthenticated, handleAssignRoles);

// remove role assignment for a user
userRouter.delete(
  "/assign-role/:userId",
  ensureAuthenticated,
  handleRemoveRoleAssignment
);

export default userRouter;
