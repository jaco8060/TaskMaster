import dotenv from "dotenv";
import pg from "pg";
const { Pool } = pg;

dotenv.config();

const pool = new Pool({
  user: "postgres",
  password: "root123",
  host: "localhost",
  port: 5432,
  database: "bugtracker",
});

export async function getUsers() {
  try {
    const { rows } = await pool.query("SELECT * FROM users");
    return rows;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}
// const users = await getUsers();
// console.log(users);

export async function createUser(username, email = "noemail", password, role) {
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
}

const userCreated = await createUser("admin", undefined, "admin123", "admin");

console.log(userCreated);
// export async function getUser(id) {
//   try {
//     const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
//     return rows[0];
//   } catch (error) {
//     console.error(`Error fetching user with id ${id}:`, error);
//     throw error;
//   }
// }

// const result = await createUser("second user", "first password");
// console.log(result);
