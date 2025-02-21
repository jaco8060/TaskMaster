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
    // Create Demo Inc. organization FIRST with initial org_code and code_expiration
    const orgCheck = await pool.query("SELECT * FROM organizations WHERE id = 1");
    if (orgCheck.rows.length === 0) {
      await pool.query(
        `INSERT INTO organizations (id, name, org_code, code_expiration) 
         VALUES (1, 'Demo Inc.', $1, NOW() + INTERVAL '1 minute')`,
        [Math.random().toString(36).substring(2, 22)] // Simple random code for seeding
      );
      console.log("Organization Demo Inc. created with initial org_code and code_expiration");
    }

    // Seed users with organization_id = 1
    for (const user of users) {
      const res = await pool.query("SELECT * FROM users WHERE username = $1", [
        user.username,
      ]);

      if (res.rows.length === 0) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await pool.query(
          `INSERT INTO users 
            (username, email, password, role, organization_id) 
           VALUES ($1, $2, $3, $4, $5)`,
          [
            user.username,
            `${user.username}@example.com`,
            hashedPassword,
            user.role,
            1,
          ]
        );
        console.log(`User ${user.username} created.`);
      }
    }

    // Set the admin_id after users are created
    await pool.query(
      `UPDATE organizations SET admin_id = 4 WHERE id = 1`
    );
    console.log("Set admin_id for Demo Inc.");

    // Add organization members
    const membersToAdd = [
      { user_id: 1 }, // demo_sub
      { user_id: 2 }, // demo_dev
      { user_id: 3 }, // demo_pm
      { user_id: 4 }, // demo_admin
    ];

    for (const member of membersToAdd) {
      const memberCheck = await pool.query(
        "SELECT * FROM organization_members WHERE organization_id = 1 AND user_id = $1",
        [member.user_id]
      );
      if (memberCheck.rows.length === 0) {
        await pool.query(
          `INSERT INTO organization_members 
          (organization_id, user_id, status) 
          VALUES (1, $1, 'approved')`,
          [member.user_id]
        );
        console.log(`Added user ${member.user_id} to organization members`);
      }
    }

    console.log("Seeding completed.");
  } catch (error) {
    console.error("Error seeding users:", error);
  }
};

export default seedUsers;