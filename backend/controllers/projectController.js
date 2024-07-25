import {
  assignPersonnel,
  createProject,
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
