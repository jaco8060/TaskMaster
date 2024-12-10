// routes/tickets.js

import express from "express";
import multer from "multer";
import {
  handleCreateAttachment,
  handleGetAttachments,
  handleUpdateAttachmentDescription,
} from "../controllers/attachmentController.js";
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

const storage = multer.diskStorage({
  destination: "uploads/", // ensure this directory exists
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

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

// Attachment routes
ticketRouter.get("/:id/attachments", ensureAuthenticated, handleGetAttachments);
ticketRouter.post(
  "/:id/attachments",
  ensureAuthenticated,
  upload.single("attachment"),
  handleCreateAttachment
);
ticketRouter.put(
  "/:id/attachments/:attachmentId",
  ensureAuthenticated,
  handleUpdateAttachmentDescription
);

export default ticketRouter;
