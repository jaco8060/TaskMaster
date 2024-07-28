import express from "express";
import {
  handleCreateTicket,
  handleDeleteTicket,
  handleGetTicketById,
  handleGetTicketsByProjectId,
  handleGetTicketsByUserId,
  handleUpdateTicket,
} from "../controllers/ticketController.js";

const ticketRouter = express.Router();

ticketRouter.post("/", handleCreateTicket);
ticketRouter.get("/project/:projectId", handleGetTicketsByProjectId);
ticketRouter.get("/:id", handleGetTicketById);
ticketRouter.put("/:id", handleUpdateTicket);
ticketRouter.delete("/:id", handleDeleteTicket);
ticketRouter.get("/user/:userId", handleGetTicketsByUserId); // Add this route

export default ticketRouter;
