import { pool } from "../database.js";

export const createNotification = async (user_id, message, ticketId = null, projectId = null) => {
  try {
    const { rows } = await pool.query(
      `INSERT INTO notifications (user_id, message, ticket_id, project_id) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [user_id, message, ticketId, projectId]
    );
    return rows[0];
  } catch (error) {
    throw error;
  }
};

export const getNotificationsForUser = async (userId, onlyUnread = false) => {
  try {
    const { rows } = await pool.query(
      `SELECT n.*, 
        t.title as ticket_title, 
        COALESCE(p.name, p2.name) as project_name,
        COALESCE(t.project_id, p2.id) as project_id
       FROM notifications n
       LEFT JOIN tickets t ON n.ticket_id = t.id
       LEFT JOIN projects p ON t.project_id = p.id
       LEFT JOIN projects p2 ON n.project_id = p2.id
       WHERE n.user_id = $1 ${onlyUnread ? 'AND is_read = false' : ''}
       ORDER BY created_at DESC`,
      [userId]
    );
    return rows;
  } catch (error) {
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId, user_id) => {
  try {
    const { rows } = await pool.query(
      `UPDATE notifications 
       SET is_read = true 
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [notificationId, user_id]
    );
    return rows[0] || null;
  } catch (error) {
    throw error;
  }
};

export const markAllNotificationsAsRead = async (user_id) => {
  try {
    await pool.query(
      `UPDATE notifications 
       SET is_read = true 
       WHERE user_id = $1 AND is_read = false`,
      [user_id]
    );
  } catch (error) {
    throw error;
  }
};

export const deleteAllNotificationsForUser = async (user_id) => {
  try {
    await pool.query(
      `DELETE FROM notifications 
       WHERE user_id = $1`,
      [user_id]
    );
  } catch (error) {
    throw error;
  }
};
