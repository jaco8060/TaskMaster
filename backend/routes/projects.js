import express from "express";
import {
  handleCreateProject,
  handleGetProjectsByUserId,
} from "../controllers/projectController.js";

const projectRouter = express.Router();

projectRouter.post("/", handleCreateProject);
projectRouter.get("/", handleGetProjectsByUserId);

export default projectRouter;
