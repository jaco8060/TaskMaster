import { pool } from "../database.js";

export const createAttachment = async (ticket_id, filename, description) => {
  try {
    const result = await pool.query(
      "INSERT INTO attachments (ticket_id, filename, description) VALUES ($1, $2, $3) RETURNING *",
      [ticket_id, filename, description]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

export const getAttachmentsByTicketId = async (ticket_id) => {
  try {
    const result = await pool.query(
      "SELECT * FROM attachments WHERE ticket_id = $1 ORDER BY uploaded_at ASC",
      [ticket_id]
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
};

export const updateAttachmentDescription = async (
  ticket_id,
  attachmentId,
  description
) => {
  try {
    const result = await pool.query(
      "UPDATE attachments SET description = $1 WHERE id = $2 AND ticket_id = $3 RETURNING *",
      [description, attachmentId, ticket_id]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};
