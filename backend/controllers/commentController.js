// controllers/commentController.js

import {
  createComment,
  getCommentsByTicketId,
} from "../models/commentModel.js";
import { createNotification } from "../models/notificationModel.js";
import { getTicketById } from "../models/ticketModel.js";

// Create a new comment
export const handleCreateComment = async (req, res) => {
  const ticket_id = req.params.id;
  const user_id = req.user.id;
  const { comment } = req.body;

  if (!comment || !comment.trim()) {
    return res.status(400).json({ error: "Comment cannot be empty." });
  }

  try {
    // Create the new comment first
    const newComment = await createComment(ticket_id, user_id, comment.trim());

    // Fetch ticket details for notifications
    const ticket = await getTicketById(ticket_id);

    // Notify assigned user if they are not the one commenting
    if (ticket.assigned_to && ticket.assigned_to !== user_id) {
      await createNotification(
        ticket.assigned_to,
        `New comment on ticket (#${ticket_id}).`
      );
    }

    // Notify the ticket creator if they are not the one commenting
    if (ticket.reported_by && ticket.reported_by !== user_id) {
      await createNotification(
        ticket.reported_by,
        `New comment on ticket (#${ticket_id}) you created.`
      );
    }

    res.status(201).json(newComment);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ error: "Failed to create comment." });
  }
};

// Get all comments for a ticket
export const handleGetCommentsByTicketId = async (req, res) => {
  const ticket_id = req.params.id;

  try {
    const comments = await getCommentsByTicketId(ticket_id);
    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Failed to fetch comments." });
  }
};
