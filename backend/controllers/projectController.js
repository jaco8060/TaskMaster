import { createNotification } from "../models/notificationModel.js";
import {
  assignMultiplePersonnel,
  assignPersonnel,
  createProject,
  getAllProjectsForUser,
  getAssignedPersonnel,
  getProjectById,
  getProjectsByUserId,
  removePersonnel,
  updateProject,
} from "../models/projectModel.js";

export const handleCreateProject = async (req, res) => {
  const { name, description, user_id } = req.body;
  try {
    const project = await createProject(name, description, user_id);
    res.status(201).json(project);
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const handleGetProjectById = async (req, res) => {
  const projectId = req.params.id;
  try {
    const project = await getProjectById(projectId);
    res.status(200).json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const handleGetProjectsByUserId = async (req, res) => {
  const userId = req.params.userId;
  try {
    const projects = await getProjectsByUserId(userId);
    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const handleGetProjectsByQueryParam = async (req, res) => {
  const user_id = req.query.user_id;
  try {
    const projects = await getProjectsByUserId(user_id);
    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const handleGetAssignedPersonnel = async (req, res) => {
  const projectId = req.params.id;
  try {
    const personnel = await getAssignedPersonnel(projectId);
    res.status(200).json(personnel);
  } catch (error) {
    console.error("Error fetching assigned personnel:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const handleAssignPersonnel = async (req, res) => {
  const projectId = req.params.id;
  const { userId, role } = req.body;
  try {
    const assignment = await assignPersonnel(projectId, userId, role);

    // notify user assigned
    await createNotification(
      userId,
      `You have been assigned to project (ID: ${projectId})`
    );

    res.status(201).json(assignment);
  } catch (error) {
    console.error("Error assigning personnel:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const handleUpdateProject = async (req, res) => {
  const projectId = req.params.id;
  const { name, description, is_active } = req.body;
  try {
    const updatedProject = await updateProject(
      projectId,
      name,
      description,
      is_active
    );
    res.status(200).json(updatedProject);
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const handleRemovePersonnel = async (req, res) => {
  const { id: projectId, userId } = req.params;
  try {
    const removedPersonnel = await removePersonnel(projectId, userId);
    if (!removedPersonnel) {
      return res.status(404).json({ error: "Personnel not found" });
    }
    res.status(200).json(removedPersonnel);
  } catch (error) {
    console.error("Error removing personnel:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const handleAssignMultiplePersonnel = async (req, res) => {
  const projectId = req.params.id;
  // Expect an array of user IDs
  const { userIds, role } = req.body;
  try {
    // Assign each user in a loop
    const assignments = await assignMultiplePersonnel(projectId, userIds, role);

    // Example: notify them
    for (const assignment of assignments) {
      await createNotification(
        assignment.user_id,
        `You have been assigned to project (ID: ${projectId}).`
      );
    }

    res.status(201).json(assignments);
  } catch (error) {
    console.error("Error assigning multiple personnel:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const handleGetAllProjectsForUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const projects = await getAllProjectsForUser(userId);
    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching all projects for user:", error);
    res.status(500).json({ error: "Server error" });
  }
};
