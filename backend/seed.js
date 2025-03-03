// backend/seed.js

import bcrypt from "bcrypt";
import { indexProject } from "./controllers/projectController.js";
import { indexTicket } from "./controllers/ticketController.js";
import { indexUser } from "./controllers/userController.js";
import { pool } from "./database.js";
import { meiliClient } from "./meilisearch.js";

// Function to initialize indexes with primary keys
export const initializeIndexes = async () => {
  try {
    const indexes = [
      {
        name: "users",
        primaryKey: "id",
        filterableAttributes: ["organization_id"],
      },
      {
        name: "tickets",
        primaryKey: "id",
        filterableAttributes: ["project_id", "assigned_to", "reported_by"],
      },
      {
        name: "projects",
        primaryKey: "id",
        filterableAttributes: ["user_id", "organization_id"],
      },
    ];

    for (const index of indexes) {
      // Delete existing index if it exists
      try {
        await meiliClient.deleteIndex(index.name);
        console.log(`Deleted existing index: ${index.name}`);
      } catch (error) {
        if (error.code !== "index_not_found") {
          throw error;
        }
      }

      // Create the index with the primary key
      await meiliClient.createIndex(index.name, {
        primaryKey: index.primaryKey,
      });
      console.log(
        `Created index: ${index.name} with primary key '${index.primaryKey}'`
      );

      // Set filterable attributes
      await meiliClient.index(index.name).updateSettings({
        filterableAttributes: index.filterableAttributes,
      });
      console.log(
        `Set filterable attributes for ${
          index.name
        }: ${index.filterableAttributes.join(", ")}`
      );
    }
  } catch (error) {
    console.error("Error initializing indexes:", error);
    throw error;
  }
};

export const seedUsers = async () => {
  const users = [
    { username: "demo_sub", password: "demo123", role: "submitter" },
    { username: "demo_dev", password: "demo123", role: "developer" },
    { username: "demo_pm", password: "demo123", role: "pm" },
    { username: "demo_admin", password: "demo123", role: "admin" },
  ];

  try {
    // Create Demo Inc. organization FIRST with initial org_code and code_expiration
    const orgCheck = await pool.query(
      "SELECT * FROM organizations WHERE id = 1"
    );
    if (orgCheck.rows.length === 0) {
      await pool.query(
        `INSERT INTO organizations (id, name, org_code, code_expiration) 
         VALUES (1, 'Demo Inc.', $1, NOW() + INTERVAL '1 minute')`,
        [Math.random().toString(36).substring(2, 22)] // Simple random code for seeding
      );
      console.log(
        "Organization Demo Inc. created with initial org_code and code_expiration"
      );
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
    await pool.query(`UPDATE organizations SET admin_id = 4 WHERE id = 1`);
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

export const indexAllData = async () => {
  try {
    const users = await pool.query("SELECT * FROM users");
    const tickets = await pool.query("SELECT * FROM tickets");
    const projects = await pool.query("SELECT * FROM projects");

    await Promise.all([
      ...users.rows.map((user) => indexUser(user)),
      ...tickets.rows.map((ticket) => indexTicket(ticket)),
      ...projects.rows.map((project) => indexProject(project)),
    ]);
    console.log("Data indexed successfully");
  } catch (error) {
    console.error("Indexing error:", error);
  }
};
