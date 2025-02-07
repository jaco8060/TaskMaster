import bcrypt from "bcrypt";
import { pool } from "../database.js";

export const getUsers = async () => {
  try {
    const { rows } = await pool.query("SELECT * FROM users");
    return rows;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const getUsersAssignedBy = async (assignedBy) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE assigned_by = $1",
      [assignedBy]
    );
    return rows;
  } catch (error) {
    console.error("Error fetching users assigned by:", error);
    throw error;
  }
};

export const createUser = async (
  username,
  email = "noemail",
  password,
  role
) => {
  try {
    const result = await pool.query(
      "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
      [username, email, password, role]
    );
    return result.rows[0];
  } catch (error) {
    if (error.code === "23505") {
      // Handle unique constraint violation
      if (error.constraint === "users_username_key") {
        return { error: "Username already exists" };
      } else if (error.constraint === "users_email_key") {
        return { error: "Email already exists" };
      }
    }
    console.error("Error creating user:", error);
    throw error;
  }
};

export const assignRoles = async (userIds, role, assignedBy) => {
  try {
    await pool.query(
      "UPDATE users SET role = $1, assigned_by = $2 WHERE id = ANY($3::int[])",
      [role, assignedBy, userIds]
    );
  } catch (error) {
    console.error("Error assigning roles:", error);
    throw error;
  }
};

export const updateUserProfile = async (
  userId,
  { username, email, password, profile_picture }
) => {
  try {
    let query;
    let params;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query = `
        UPDATE users 
        SET username = COALESCE($2, username),
            email = COALESCE($3, email),
            profile_picture = COALESCE($4, profile_picture),
            password = $5
        WHERE id = $1 
        RETURNING *
      `;
      params = [userId, username, email, profile_picture, hashedPassword];
    } else {
      query = `
        UPDATE users 
        SET username = COALESCE($2, username),
            email = COALESCE($3, email),
            profile_picture = COALESCE($4, profile_picture)
        WHERE id = $1 
        RETURNING *
      `;
      params = [userId, username, email, profile_picture];
    }
    const result = await pool.query(query, params);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};
