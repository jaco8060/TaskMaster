// backend/routes/dashboard.js

import express from "express";
import { pool } from "../database.js";

const router = express.Router();

// GET /dashboard/user-metrics?userId=...
router.get("/user-metrics", async (req, res) => {
  // Assume req.user is available (using ensureAuthenticated)
  const userId = req.query.userId;
  const organizationId = req.user.organization_id; // from user membership

  if (!userId || !organizationId) {
    return res.status(400).json({ error: "Missing userId or organization" });
  }

  try {
    // Active projects in the same organization
    const activeProjectsRes = await pool.query(
      `SELECT COUNT(DISTINCT p.id) as activeProjects
       FROM projects p
       LEFT JOIN assigned_personnel ap ON p.id = ap.project_id
       WHERE (p.user_id = $1 OR ap.user_id = $1)
         AND p.organization_id = $2`,
      [userId, organizationId]
    );

    // Total tickets for the user (using the project organization)
    const totalTicketsRes = await pool.query(
      `SELECT COUNT(DISTINCT t.id) as totalTickets
       FROM tickets t
       JOIN projects p ON t.project_id = p.id
       LEFT JOIN assigned_ticket_users atu ON t.id = atu.ticket_id
       WHERE (t.reported_by = $1 OR t.assigned_to = $1 OR atu.user_id = $1)
         AND p.organization_id = $2`,
      [userId, organizationId]
    );

    // Unassigned tickets in this organization:
    const unassignedTicketsRes = await pool.query(
      `SELECT COUNT(*) as unassignedTickets
       FROM tickets t
       JOIN projects p ON t.project_id = p.id
       WHERE t.assigned_to IS NULL
         AND p.organization_id = $1`,
      [organizationId]
    );

    // Notifications (by user id – already user-specific)
    const notificationsRes = await pool.query(
      `SELECT COUNT(*) as notifications
       FROM notifications
       WHERE user_id = $1 AND is_read = false`,
      [userId]
    );

    const metrics = {
      activeProjects: parseInt(activeProjectsRes.rows[0].activeprojects, 10),
      totalTickets: parseInt(totalTicketsRes.rows[0].totaltickets, 10),
      unassignedTickets: parseInt(
        unassignedTicketsRes.rows[0].unassignedtickets,
        10
      ),
      notifications: parseInt(notificationsRes.rows[0].notifications, 10),
    };
    res.json(metrics);
  } catch (error) {
    console.error("Error in /dashboard/user-metrics:", error);
    res.status(500).json({ error: "Failed to fetch user metrics" });
  }
});

// GET /dashboard/admin-metrics
router.get("/admin-metrics", async (req, res) => {
  const organizationId = req.user.organization_id;
  try {
    const newUsersRes = await pool.query(
      `SELECT COUNT(*) as newUsers
       FROM users u
       JOIN organization_members om ON u.id = om.user_id
       WHERE om.organization_id = $1
         AND u.created_at >= NOW() - INTERVAL '7 days'`,
      [organizationId]
    );
    const totalUsersRes = await pool.query(
      `SELECT COUNT(*) as totalUsers
       FROM users u
       JOIN organization_members om ON u.id = om.user_id
       WHERE om.organization_id = $1`,
      [organizationId]
    );
    const ticketsInDevelopmentRes = await pool.query(
      `SELECT COUNT(*) as ticketsInDevelopment
       FROM tickets t
       JOIN projects p ON t.project_id = p.id
       WHERE t.status = 'In Progress'
         AND p.organization_id = $1`,
      [organizationId]
    );
    const totalDevelopersRes = await pool.query(
      `SELECT COUNT(*) as totalDevelopers
       FROM users u
       JOIN organization_members om ON u.id = om.user_id
       WHERE om.organization_id = $1
         AND u.role = 'developer'`,
      [organizationId]
    );

    const metrics = {
      newUsers: parseInt(newUsersRes.rows[0].newusers, 10),
      totalUsers: parseInt(totalUsersRes.rows[0].totalusers, 10),
      ticketsInDevelopment: parseInt(
        ticketsInDevelopmentRes.rows[0].ticketsindevelopment,
        10
      ),
      totalDevelopers: parseInt(totalDevelopersRes.rows[0].totaldevelopers, 10),
    };
    res.json(metrics);
  } catch (error) {
    console.error("Error in /dashboard/admin-metrics:", error);
    res.status(500).json({ error: "Failed to fetch admin metrics" });
  }
});

// GET /dashboard/priority-projects
router.get("/priority-projects", async (req, res) => {
  const organizationId = req.user.organization_id;
  try {
    const result = await pool.query(
      `SELECT t.priority, COUNT(*) as count
       FROM tickets t
       JOIN projects p ON t.project_id = p.id
       WHERE p.organization_id = $1
       GROUP BY t.priority`,
      [organizationId]
    );
    const data = result.rows.map((row) => ({
      name: row.priority,
      value: parseInt(row.count, 10),
    }));
    res.json(data);
  } catch (error) {
    console.error("Error in /dashboard/priority-projects:", error);
    res.status(500).json({ error: "Failed to fetch priority projects data" });
  }
});

// GET /dashboard/user-types
router.get("/user-types", async (req, res) => {
  const organizationId = req.user.organization_id;
  try {
    const result = await pool.query(
      `SELECT u.role as type, COUNT(*) as count
       FROM users u
       JOIN organization_members om ON u.id = om.user_id
       WHERE om.organization_id = $1
       GROUP BY u.role`,
      [organizationId]
    );
    const data = result.rows.map((row) => ({
      type: row.type,
      count: parseInt(row.count, 10),
    }));
    res.json(data);
  } catch (error) {
    console.error("Error in /dashboard/user-types:", error);
    res.status(500).json({ error: "Failed to fetch user types data" });
  }
});

// GET /dashboard/ticket-distribution
router.get("/ticket-distribution", async (req, res) => {
  const organizationId = req.user.organization_id;
  try {
    const result = await pool.query(
      `SELECT p.name as project, COUNT(t.id) as tickets
       FROM projects p
       LEFT JOIN tickets t ON p.id = t.project_id
       WHERE p.organization_id = $1
       GROUP BY p.name
       ORDER BY tickets DESC`,
      [organizationId]
    );
    let data = result.rows.map((row) => ({
      project: row.project,
      tickets: parseInt(row.tickets, 10),
    }));

    // If more than 5 projects, group the rest as "Other"
    if (data.length > 5) {
      const top5 = data.slice(0, 5);
      const otherCount = data
        .slice(5)
        .reduce((sum, item) => sum + item.tickets, 0);
      top5.push({ project: "Other", tickets: otherCount });
      data = top5;
    }
    res.json(data);
  } catch (error) {
    console.error("Error in /dashboard/ticket-distribution:", error);
    res.status(500).json({ error: "Failed to fetch ticket distribution data" });
  }
});

export default router;
