import express from "express";
import { pool } from "../database.js";
import { ensureAuthenticated } from "../middleware/authMiddleware.js";

const userRouter = express.Router();

// Define the route to get users
userRouter.get("/", ensureAuthenticated, async (req, res) => {
  const assignedBy = req.query.assigned_by;
  try {
    const users = assignedBy
      ? await getUsersAssignedBy(assignedBy)
      : await getUsers();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// route to assign user roles
userRouter.post("/assign-role", ensureAuthenticated, async (req, res) => {
  const { userIds, role } = req.body;
  console.log(req.user);
  const assignedBy = req.user.id; // logged-in user's ID in req.user

  try {
    await pool.query(
      "UPDATE users SET role = $1, assigned_by = $2 WHERE id = ANY($3::int[])",
      [role, assignedBy, userIds]
    );
    res.status(200).send({ message: "Role assigned successfully!" });
  } catch (error) {
    console.error("Error assigning role:", error);
    res.status(500).send({ error: "Failed to assign role." });
  }
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

export async function getUsersAssignedBy(assignedBy) {
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
}

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

const userCreated = await createUser("guest3", undefined, "guest123", "user");

// export async function getUser(id) {
//   try {
//     const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
//     return rows[0];
//   } catch (error) {
//     console.error(`Error fetching user with id ${id}:`, error);
//     throw error;
//   }
// }
export default userRouter;
