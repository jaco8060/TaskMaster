import { pool } from "../database.js";

export const createTicket = async (
  title,
  description,
  status,
  priority,
  project_id,
  reported_by,
  assigned_to
) => {
  try {
    const result = await pool.query(
      "INSERT INTO tickets (title, description, status, priority, project_id, reported_by, assigned_to) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [
        title,
        description,
        status,
        priority,
        project_id,
        reported_by,
        assigned_to,
      ]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

export const getTicketsByProjectId = async (projectId) => {
  try {
    const result = await pool.query(
      "SELECT * FROM tickets WHERE project_id = $1",
      [projectId]
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
};

export const getTicketById = async (ticketId) => {
  try {
    const result = await pool.query("SELECT * FROM tickets WHERE id = $1", [
      ticketId,
    ]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

export const updateTicket = async (
  id,
  title,
  description,
  status,
  priority,
  assigned_to
) => {
  try {
    const result = await pool.query(
      "UPDATE tickets SET title = $1, description = $2, status = $3, priority = $4, assigned_to = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *",
      [title, description, status, priority, assigned_to, id]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

export const deleteTicket = async (id) => {
  try {
    const result = await pool.query(
      "DELETE FROM tickets WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

export const getTicketsByUserId = async (userId) => {
  try {
    const result = await pool.query(
      "SELECT * FROM tickets WHERE assigned_to = $1",
      [userId]
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
};
