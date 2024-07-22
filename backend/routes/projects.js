import express from "express";
import {
  handleCreateProject,
  handleGetProjectById,
  handleGetProjectsByUserId,
} from "../controllers/projectController.js";

const projectRouter = express.Router();

projectRouter.post("/", handleCreateProject);
projectRouter.get("/", handleGetProjectsByUserId);
projectRouter.get("/:id", handleGetProjectById); // New route for fetching project details by ID

export default projectRouter;
