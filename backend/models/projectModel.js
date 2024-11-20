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

export const getProjectById = async (projectId) => {
  try {
    const result = await pool.query("SELECT * FROM projects WHERE id = $1", [
      projectId,
    ]);
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

export const getAssignedPersonnel = async (projectId) => {
  try {
    const result = await pool.query(
      `SELECT users.id, users.username, users.email, assigned_personnel.role, assigned_personnel.assigned_at 
       FROM users
       JOIN assigned_personnel ON users.id = assigned_personnel.user_id
       WHERE assigned_personnel.project_id = $1`,
      [projectId]
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
};

export const assignPersonnel = async (projectId, userId) => {
  try {
    // Fetch the user's current role
    const { rows } = await pool.query("SELECT role FROM users WHERE id = $1", [
      userId,
    ]);
    const userRole = rows[0]?.role;

    // Insert into assigned_personnel with the user's role
    const result = await pool.query(
      "INSERT INTO assigned_personnel (project_id, user_id, role) VALUES ($1, $2, $3) RETURNING *",
      [projectId, userId, userRole]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

export const removePersonnel = async (projectId, userId) => {
  try {
    const result = await pool.query(
      "DELETE FROM assigned_personnel WHERE project_id = $1 AND user_id = $2 RETURNING *",
      [projectId, userId]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

export const updateProject = async (id, name, description, is_active) => {
  try {
    const result = await pool.query(
      "UPDATE projects SET name = $1, description = $2, is_active = $3 WHERE id = $4 RETURNING *",
      [name, description, is_active, id]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};
