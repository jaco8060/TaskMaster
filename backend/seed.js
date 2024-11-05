// backend/seed.js

import bcrypt from "bcrypt";
import { pool } from "./database.js";

export const seedUsers = async () => {
  const users = [
    { username: "demo_sub", password: "demo123", role: "submitter" },
    { username: "demo_dev", password: "demo123", role: "developer" },
    { username: "demo_pm", password: "demo123", role: "pm" },
    { username: "demo_admin", password: "demo123", role: "admin" },
  ];

  try {
    for (const user of users) {
      // Check if the user already exists
      const res = await pool.query("SELECT * FROM users WHERE username = $1", [
        user.username,
      ]);

      if (res.rows.length === 0) {
        // Hash the password
        const hashedPassword = await bcrypt.hash(user.password, 10);

        // Insert the user into the database
        await pool.query(
          "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4)",
          [
            user.username,
            `${user.username}@example.com`,
            hashedPassword,
            user.role,
          ]
        );

        console.log(`User ${user.username} created.`);
      } else {
        console.log(`User ${user.username} already exists.`);
      }
    }

    console.log("Seeding completed.");
  } catch (error) {
    console.error("Error seeding users:", error);
  }
  // Do not call pool.end() here
};

// Export the function if not already exported
export default seedUsers;
