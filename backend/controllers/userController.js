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
