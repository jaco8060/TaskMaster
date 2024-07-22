import express from "express";
import {
  handleAssignPersonnel,
  handleCreateProject,
  handleGetAssignedPersonnel,
  handleGetProjectById,
  handleGetProjectsByUserId,
} from "../controllers/projectController.js";

const projectRouter = express.Router();

projectRouter.post("/", handleCreateProject);
projectRouter.get("/", handleGetProjectsByUserId);
projectRouter.get("/:id", handleGetProjectById);
projectRouter.get("/:id/personnel", handleGetAssignedPersonnel);
projectRouter.post("/:id/personnel", handleAssignPersonnel);

export default projectRouter;
