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
      `SELECT 
        t.*,
        p.name as project_name,
        reporter.username as reported_by_name,
        assignee.username as assigned_to_name
      FROM tickets t
      LEFT JOIN projects p ON t.project_id = p.id
      LEFT JOIN users reporter ON t.reported_by = reporter.id
      LEFT JOIN users assignee ON t.assigned_to = assignee.id
      WHERE t.project_id = $1`,
      [projectId]
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
};

export const getTicketById = async (ticketId) => {
  try {
    const result = await pool.query(
      `SELECT 
        t.*,
        p.name as project_name,
        reporter.username as reported_by_name,
        assignee.username as assigned_to_name
      FROM tickets t
      LEFT JOIN projects p ON t.project_id = p.id
      LEFT JOIN users reporter ON t.reported_by = reporter.id
      LEFT JOIN users assignee ON t.assigned_to = assignee.id
      WHERE t.id = $1`,
      [ticketId]
    );
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
    // First update the ticket
    await pool.query(
      "UPDATE tickets SET title = $1, description = $2, status = $3, priority = $4, assigned_to = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6",
      [title, description, status, priority, assigned_to, id]
    );

    // Then fetch the updated ticket with all joined data
    const result = await pool.query(
      `SELECT 
        t.*,
        p.name as project_name,
        reporter.username as reported_by_name,
        assignee.username as assigned_to_name
      FROM tickets t
      LEFT JOIN projects p ON t.project_id = p.id
      LEFT JOIN users reporter ON t.reported_by = reporter.id
      LEFT JOIN users assignee ON t.assigned_to = assignee.id
      WHERE t.id = $1`,
      [id]
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
      `SELECT 
        t.*,
        p.name as project_name,
        reporter.username as reported_by_name,
        assignee.username as assigned_to_name
      FROM tickets t
      LEFT JOIN projects p ON t.project_id = p.id
      LEFT JOIN users reporter ON t.reported_by = reporter.id
      LEFT JOIN users assignee ON t.assigned_to = assignee.id
      WHERE t.reported_by = $1 OR t.assigned_to = $1`,
      [userId]
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
};
