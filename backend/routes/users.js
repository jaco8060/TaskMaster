import express from "express";
import {
  handleAssignRoles,
  handleGetUserById,
  handleGetUsers,
  handleRemoveRoleAssignment,
  handleRequestRoleChange,
  handleUpdateUserProfile,
  uploadProfilePicture,
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

// Update profile (with profile picture upload)
userRouter.put(
  "/profile",
  ensureAuthenticated,
  uploadProfilePicture.single("profile_picture"),
  handleUpdateUserProfile
);

// Request a role change/message to admin/pm
userRouter.post(
  "/request-role-change",
  ensureAuthenticated,
  handleRequestRoleChange
);

userRouter.get("/:id", ensureAuthenticated, handleGetUserById);

export default userRouter;
