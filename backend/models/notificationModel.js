import { pool } from "../database.js";

export const createNotification = async (user_id, message) => {
  try {
    const { rows } = await pool.query(
      `INSERT INTO notifications (user_id, message) 
       VALUES ($1, $2) RETURNING *`,
      [user_id, message]
    );
    return rows[0];
  } catch (error) {
    throw error;
  }
};

export const getNotificationsForUser = async (user_id, onlyUnread = false) => {
  try {
    let query = `SELECT * FROM notifications WHERE user_id = $1`;
    if (onlyUnread) {
      query += ` AND is_read = false`;
    }
    query += ` ORDER BY created_at DESC`;
    const { rows } = await pool.query(query, [user_id]);
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
