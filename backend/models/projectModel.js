import { pool } from "../database.js";

export const createProject = async (name, description, user_id) => {
  try {
    const result = await pool.query(
      "INSERT INTO projects (name, description, user_id) VALUES ($1, $2, $3) RETURNING *",
      [name, description, user_id]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

export const getProjectsByUserId = async (user_id) => {
  try {
    const result = await pool.query(
      "SELECT * FROM projects WHERE user_id = $1",
      [user_id]
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
};
