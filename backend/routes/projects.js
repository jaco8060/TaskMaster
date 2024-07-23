import express from "express";
import {
  handleAssignPersonnel,
  handleCreateProject,
  handleGetAssignedPersonnel,
  handleGetProjectById,
  handleGetProjectsByUserId,
  handleUpdateProject, // Import the new handler
} from "../controllers/projectController.js";

const projectRouter = express.Router();

projectRouter.post("/", handleCreateProject);
projectRouter.get("/", handleGetProjectsByUserId);
projectRouter.get("/:id", handleGetProjectById);
projectRouter.put("/:id", handleUpdateProject); // Add this route for updating project details
projectRouter.get("/:id/personnel", handleGetAssignedPersonnel);
projectRouter.post("/:id/personnel", handleAssignPersonnel);

export default projectRouter;
