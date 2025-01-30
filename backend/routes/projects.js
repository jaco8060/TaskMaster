import express from "express";
import {
  handleAssignMultiplePersonnel,
  handleAssignPersonnel,
  handleCreateProject,
  handleGetAllProjectsForUser,
  handleGetAssignedPersonnel,
  handleGetProjectById,
  handleGetProjectsByQueryParam,
  handleGetProjectsByUserId,
  handleRemovePersonnel,
  handleUpdateProject,
} from "../controllers/projectController.js";

const projectRouter = express.Router();

projectRouter.post("/", handleCreateProject);
projectRouter.get("/", handleGetProjectsByQueryParam); // Get projects by user ID from query parameter
projectRouter.get("/user/:userId", handleGetProjectsByUserId); // Get projects by user ID from URL parameter
projectRouter.get("/:id", handleGetProjectById);
projectRouter.put("/:id", handleUpdateProject); // Update project details
projectRouter.get("/:id/personnel", handleGetAssignedPersonnel);
projectRouter.post("/:id/personnel", handleAssignPersonnel);
projectRouter.delete("/:id/personnel/:userId", handleRemovePersonnel);
projectRouter.post("/:id/personnel/multiple", handleAssignMultiplePersonnel);
projectRouter.get("/allForUser/:userId", handleGetAllProjectsForUser);

export default projectRouter;
