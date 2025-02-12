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
};

export const updateTicket = async (
  id,
  title,
  description,
  status,
  priority,
  assigned_to,
  changed_by
) => {
  const oldTicket = await getTicketById(id);

  await pool.query(
    "UPDATE tickets SET title = $1, description = $2, status = $3, priority = $4, assigned_to = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6",
    [title, description, status, priority, assigned_to, id]
  );

  const newTicket = await getTicketById(id);

  const recordChange = async (property, oldVal, newVal) => {
    if (oldVal !== newVal) {
      await pool.query(
        "INSERT INTO ticket_history (ticket_id, property, old_value, new_value, changed_by) VALUES ($1, $2, $3, $4, $5)",
        [
          id,
          property,
          oldVal === null ? "N/A" : oldVal.toString(),
          newVal === null ? "N/A" : newVal.toString(),
          changed_by,
        ]
      );
    }
  };

  // Track field changes
  await recordChange("Title", oldTicket.title, newTicket.title);
  await recordChange(
    "Description",
    oldTicket.description,
    newTicket.description
  );
  await recordChange("Status", oldTicket.status, newTicket.status);
  await recordChange("Priority", oldTicket.priority, newTicket.priority);
  await recordChange("Project", oldTicket.project_name, newTicket.project_name);
  await recordChange(
    "Assigned To",
    oldTicket.assigned_to_name,
    newTicket.assigned_to_name
  );

  return newTicket;
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

export const getTicketsByUserId = async (userId, organizationId) => {
  const result = await pool.query(
    `
    SELECT DISTINCT
      t.*,
      p.name AS project_name,
      reporter.username AS reported_by_name,
      assignee.username AS assigned_to_name
    FROM tickets t
    JOIN projects p ON t.project_id = p.id
    LEFT JOIN assigned_personnel ap ON p.id = ap.project_id
    LEFT JOIN assigned_ticket_users atu ON t.id = atu.ticket_id
    LEFT JOIN users reporter ON t.reported_by = reporter.id
    LEFT JOIN users assignee ON t.assigned_to = assignee.id
    WHERE 
      (ap.user_id = $1 OR t.reported_by = $1 OR t.assigned_to = $1 OR atu.user_id = $1)
      AND p.organization_id = $2
    `,
    [userId, organizationId]
  );
  return result.rows;
};

export const getTicketHistoryByTicketId = async (ticketId) => {
  const result = await pool.query(
    `SELECT 
      th.property,
      th.old_value,
      th.new_value,
      th.changed_at,
      changer.username AS changed_by_username
     FROM ticket_history th
     LEFT JOIN users changer ON th.changed_by = changer.id
     WHERE th.ticket_id = $1
     ORDER BY th.changed_at ASC`,
    [ticketId]
  );
  return result.rows;
};

// Assign multiple users to a given ticket
export const assignUsersToTicket = async (ticketId, userIds) => {
  const assigned = [];
  for (const userId of userIds) {
    const result = await pool.query(
      `INSERT INTO assigned_ticket_users (ticket_id, user_id)
       VALUES ($1, $2) RETURNING *`,
      [ticketId, userId]
    );
    assigned.push(result.rows[0]);
  }
  return assigned;
};

// Optional: removeUsersFromTicket, etc., for unassigning if needed
export const removeUsersFromTicket = async (ticketId, userIds) => {
  await pool.query(
    `DELETE FROM assigned_ticket_users 
     WHERE ticket_id = $1 AND user_id = ANY($2::int[])`,
    [ticketId, userIds]
  );
};
