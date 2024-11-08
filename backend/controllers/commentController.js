// controllers/commentController.js

import {
  createComment,
  getCommentsByTicketId,
} from "../models/commentModel.js";

// Create a new comment
export const handleCreateComment = async (req, res) => {
  const ticket_id = req.params.id;
  const user_id = req.user.id;
  const { comment } = req.body;

  if (!comment || !comment.trim()) {
    return res.status(400).json({ error: "Comment cannot be empty." });
  }

  try {
    const newComment = await createComment(ticket_id, user_id, comment.trim());
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
