import express from "express";
import { ensureAuthenticated } from "../middleware/authMiddleware.js";
import {
  assignRoles,
  getUsers,
  getUsersAssignedBy,
} from "../models/userModel.js";

const userRouter = express.Router();

// Define the route to get users
userRouter.get("/", ensureAuthenticated, async (req, res) => {
  const assignedBy = req.query.assigned_by;
  try {
    const users = assignedBy
      ? await getUsersAssignedBy(assignedBy)
      : await getUsers();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to assign user roles
userRouter.post("/assign-role", ensureAuthenticated, async (req, res) => {
  const { userIds, role } = req.body;
  const assignedBy = req.user.id; // logged-in user's ID in req.user

  try {
    await assignRoles(userIds, role, assignedBy);
    res.status(200).send({ message: "Role assigned successfully!" });
  } catch (error) {
    console.error("Error assigning role:", error);
    res.status(500).send({ error: "Failed to assign role." });
  }
});

export default userRouter;
