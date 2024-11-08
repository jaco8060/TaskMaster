// routes/tickets.js

import express from "express";
import {
  handleCreateComment,
  handleGetCommentsByTicketId,
} from "../controllers/commentController.js";
import {
  handleCreateTicket,
  handleDeleteTicket,
  handleGetTicketById,
  handleGetTicketsByProjectId,
  handleGetTicketsByUserId,
  handleUpdateTicket,
} from "../controllers/ticketController.js";
import { ensureAuthenticated } from "../middleware/authMiddleware.js";

const ticketRouter = express.Router();

ticketRouter.post("/", handleCreateTicket);
ticketRouter.get("/project/:projectId", handleGetTicketsByProjectId);
ticketRouter.get("/:id", handleGetTicketById);
ticketRouter.put("/:id", handleUpdateTicket);
ticketRouter.delete("/:id", handleDeleteTicket);
ticketRouter.get("/user/:userId", handleGetTicketsByUserId);

// Comment routes
ticketRouter.get(
  "/:id/comments",
  ensureAuthenticated,
  handleGetCommentsByTicketId
);
ticketRouter.post("/:id/comments", ensureAuthenticated, handleCreateComment);

export default ticketRouter;
