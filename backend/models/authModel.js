import { pool } from "../database.js";

export const findUserByUsername = async (username) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    return rows[0];
  } catch (error) {
    console.error("Error fetching user by username:", error);
    throw error;
  }
};

export const createUser = async (username, email, hashedPassword, role) => {
  try {
    const result = await pool.query(
      "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
      [username, email, hashedPassword, role]
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

export const findUserById = async (id) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    return rows[0];
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
};
