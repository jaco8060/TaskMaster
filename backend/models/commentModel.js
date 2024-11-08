// models/commentModel.js

import { pool } from "../database.js";

export const createComment = async (ticket_id, user_id, comment) => {
  try {
    const result = await pool.query(
      "INSERT INTO comments (ticket_id, user_id, comment) VALUES ($1, $2, $3) RETURNING *",
      [ticket_id, user_id, comment]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
};

export const getCommentsByTicketId = async (ticket_id) => {
  try {
    const result = await pool.query(
      `SELECT 
        c.*, 
        u.username AS commenter_username 
       FROM comments c
       LEFT JOIN users u ON c.user_id = u.id
       WHERE c.ticket_id = $1
       ORDER BY c.created_at ASC`,
      [ticket_id]
    );
    return result.rows;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};
