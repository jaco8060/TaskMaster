import express from "express";

const authRouter = express.Router();

//used for /login route
authRouter.get("/", async (req, res, next) => {
  try {
    const users = await getUsers();
  } catch (error) {
    console.log("Error fetching users:", error);
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

export default authRouter;
