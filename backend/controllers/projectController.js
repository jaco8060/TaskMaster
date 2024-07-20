import { createProject, getProjectsByUserId } from "../models/projectModel.js";

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
