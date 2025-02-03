// backend/routes/dashboard.js

import express from "express";
import { pool } from "../database.js";

const router = express.Router();

// GET /dashboard/user-metrics?userId=...
router.get("/user-metrics", async (req, res) => {
  const userId = req.query.userId;
  console.log("DEBUG: /dashboard/user-metrics called with userId:", userId);
  if (!userId) {
    console.log("DEBUG: Missing userId query parameter");
    return res
      .status(400)
      .json({ error: "userId query parameter is required" });
  }
  try {
    // Count active projects: projects owned by the user or where the user is assigned
    const activeProjectsRes = await pool.query(
      `SELECT COUNT(DISTINCT p.id) as activeProjects
       FROM projects p
       LEFT JOIN assigned_personnel ap ON p.id = ap.project_id
       WHERE p.user_id = $1 OR ap.user_id = $1`,
      [userId]
    );
    console.log("DEBUG: activeProjectsRes.rows:", activeProjectsRes.rows);
    const activeProjects = parseInt(
      activeProjectsRes.rows[0].activeprojects,
      10
    );

    // Count total tickets for this user (as reporter, single-assigned or multi-assigned)
    const totalTicketsRes = await pool.query(
      `SELECT COUNT(DISTINCT t.id) as totalTickets
       FROM tickets t
       LEFT JOIN assigned_ticket_users atu ON t.id = atu.ticket_id
       WHERE t.reported_by = $1 OR t.assigned_to = $1 OR atu.user_id = $1`,
      [userId]
    );
    console.log("DEBUG: totalTicketsRes.rows:", totalTicketsRes.rows);
    const totalTickets = parseInt(totalTicketsRes.rows[0].totaltickets, 10);

    // Count unassigned tickets overall (tickets with no single-assignment)
    const unassignedTicketsRes = await pool.query(
      `SELECT COUNT(*) as unassignedTickets
       FROM tickets
       WHERE assigned_to IS NULL`
    );
    console.log("DEBUG: unassignedTicketsRes.rows:", unassignedTicketsRes.rows);
    const unassignedTickets = parseInt(
      unassignedTicketsRes.rows[0].unassignedtickets,
      10
    );

    // Count unread notifications for the user
    const notificationsRes = await pool.query(
      `SELECT COUNT(*) as notifications
       FROM notifications
       WHERE user_id = $1 AND is_read = false`,
      [userId]
    );
    console.log("DEBUG: notificationsRes.rows:", notificationsRes.rows);
    const notifications = parseInt(notificationsRes.rows[0].notifications, 10);

    const metrics = {
      activeProjects,
      totalTickets,
      unassignedTickets,
      notifications,
    };
    console.log("DEBUG: Returning user metrics:", metrics);
    res.json(metrics);
  } catch (error) {
    console.error("Error in /dashboard/user-metrics:", error);
    res.status(500).json({ error: "Failed to fetch user metrics" });
  }
});

// GET /dashboard/admin-metrics
router.get("/admin-metrics", async (req, res) => {
  console.log("DEBUG: /dashboard/admin-metrics called");
  try {
    const newUsersRes = await pool.query(
      `SELECT COUNT(*) as newUsers
       FROM users
       WHERE created_at >= NOW() - INTERVAL '7 days'`
    );
    console.log("DEBUG: newUsersRes.rows:", newUsersRes.rows);
    const totalUsersRes = await pool.query(
      `SELECT COUNT(*) as totalUsers
       FROM users`
    );
    console.log("DEBUG: totalUsersRes.rows:", totalUsersRes.rows);
    const ticketsInDevelopmentRes = await pool.query(
      `SELECT COUNT(*) as ticketsInDevelopment
       FROM tickets
       WHERE status = 'In Progress'`
    );
    console.log(
      "DEBUG: ticketsInDevelopmentRes.rows:",
      ticketsInDevelopmentRes.rows
    );
    const totalDevelopersRes = await pool.query(
      `SELECT COUNT(*) as totalDevelopers
       FROM users
       WHERE role = 'developer'`
    );
    console.log("DEBUG: totalDevelopersRes.rows:", totalDevelopersRes.rows);

    const metrics = {
      newUsers: parseInt(newUsersRes.rows[0].newusers, 10),
      totalUsers: parseInt(totalUsersRes.rows[0].totalusers, 10),
      ticketsInDevelopment: parseInt(
        ticketsInDevelopmentRes.rows[0].ticketsindevelopment,
        10
      ),
      totalDevelopers: parseInt(totalDevelopersRes.rows[0].totaldevelopers, 10),
    };
    console.log("DEBUG: Returning admin metrics:", metrics);
    res.json(metrics);
  } catch (error) {
    console.error("Error in /dashboard/admin-metrics:", error);
    res.status(500).json({ error: "Failed to fetch admin metrics" });
  }
});

// GET /dashboard/priority-projects
router.get("/priority-projects", async (req, res) => {
  console.log("DEBUG: /dashboard/priority-projects called");
  try {
    const result = await pool.query(
      `SELECT priority, COUNT(*) as count
       FROM tickets
       GROUP BY priority`
    );
    console.log("DEBUG: priority-projects query result:", result.rows);
    const data = result.rows.map((row) => ({
      name: row.priority,
      value: parseInt(row.count, 10),
    }));
    console.log("DEBUG: Returning priority projects data:", data);
    res.json(data);
  } catch (error) {
    console.error("Error in /dashboard/priority-projects:", error);
    res.status(500).json({ error: "Failed to fetch priority projects data" });
  }
});

// GET /dashboard/user-types
router.get("/user-types", async (req, res) => {
  console.log("DEBUG: /dashboard/user-types called");
  try {
    const result = await pool.query(
      `SELECT role as type, COUNT(*) as count
       FROM users
       GROUP BY role`
    );
    console.log("DEBUG: user-types query result:", result.rows);
    const data = result.rows.map((row) => ({
      type: row.type,
      count: parseInt(row.count, 10),
    }));
    console.log("DEBUG: Returning user types data:", data);
    res.json(data);
  } catch (error) {
    console.error("Error in /dashboard/user-types:", error);
    res.status(500).json({ error: "Failed to fetch user types data" });
  }
});

// GET /dashboard/ticket-distribution
router.get("/ticket-distribution", async (req, res) => {
  console.log("DEBUG: /dashboard/ticket-distribution called");
  try {
    const result = await pool.query(
      `SELECT p.name as project, COUNT(t.id) as tickets
       FROM projects p
       LEFT JOIN tickets t ON p.id = t.project_id
       GROUP BY p.name
       ORDER BY tickets DESC`
    );
    console.log("DEBUG: ticket-distribution query result:", result.rows);
    let data = result.rows.map((row) => ({
      project: row.project,
      tickets: parseInt(row.tickets, 10),
    }));

    // Split into top 5 and "Other" if more than 5 projects
    if (data.length > 5) {
      const top5 = data.slice(0, 5);
      const otherCount = data
        .slice(5)
        .reduce((sum, item) => sum + item.tickets, 0);
      top5.push({ project: "Other", tickets: otherCount });
      data = top5;
    }
    console.log("DEBUG: Returning ticket distribution data:", data);
    res.json(data);
  } catch (error) {
    console.error("Error in /dashboard/ticket-distribution:", error);
    res.status(500).json({ error: "Failed to fetch ticket distribution data" });
  }
});

export default router;
