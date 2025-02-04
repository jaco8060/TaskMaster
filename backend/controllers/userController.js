import { pool } from "../database.js";
import {
  assignRoles,
  getUsers,
  getUsersAssignedBy,
} from "../models/userModel.js";

export const handleGetUsers = async (req, res) => {
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
};

export const handleAssignRoles = async (req, res) => {
  const { userIds, role } = req.body;
  const assignedBy = req.user.id; // logged-in user's ID in req.user

  try {
    await assignRoles(userIds, role, assignedBy);
    res.status(200).send({ message: "Role assigned successfully!" });
  } catch (error) {
    console.error("Error assigning role:", error);
    res.status(500).send({ error: "Failed to assign role." });
  }
};

export const handleRemoveRoleAssignment = async (req, res) => {
  const userId = req.params.userId;
  try {
    const result = await pool.query(
      "UPDATE users SET role = 'user', assigned_by = NULL WHERE id = $1 RETURNING *",
      [userId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "Role assignment removed successfully" });
  } catch (error) {
    console.error("Error removing role assignment:", error);
    res.status(500).json({ error: "Failed to remove role assignment" });
  }
};
