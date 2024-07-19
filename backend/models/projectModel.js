import { pool } from "../database.js";

export async function getProjectsByUserId(userId) {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM projects WHERE user_id = $1",
      [userId]
    );
    return rows;
  } catch (error) {
    console.error("Error fetching projects by user ID:", error);
    throw error;
  }
}
