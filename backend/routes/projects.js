import express from "express";
import { ensureAuthenticated } from "../middleware/authMiddleware.js";
import { getProjectsByUserId } from "../models/projectModel.js";

const projectRouter = express.Router();

projectRouter.get("/", ensureAuthenticated, async (req, res) => {
  const userId = req.query.user_id;
  try {
    const projects = await getProjectsByUserId(userId);
    res.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default projectRouter;
