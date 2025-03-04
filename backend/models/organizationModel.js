import { pool } from "../database.js";

export const createOrganization = async (name, admin_id) => {
  const result = await pool.query(
    `INSERT INTO organizations (name, admin_id) 
     VALUES ($1, $2) RETURNING *`,
    [name, admin_id]
  );
  return result.rows[0];
};

export const getOrganizationById = async (orgId) => {
  const result = await pool.query("SELECT * FROM organizations WHERE id = $1", [
    orgId,
  ]);
  return result.rows[0];
};

export const searchOrganizations = async (searchTerm) => {
  const result = await pool.query(
    `SELECT 
      o.*,
      COUNT(om.user_id) FILTER (WHERE om.status = 'approved') as member_count
     FROM organizations o
     LEFT JOIN organization_members om ON o.id = om.organization_id
     WHERE o.name ILIKE $1
     GROUP BY o.id`,
    [`%${searchTerm}%`]
  );
  return result.rows;
};

export const addOrganizationMember = async (
  user_id,
  organization_id,
  status = "approved"
) => {
  const result = await pool.query(
    "INSERT INTO organization_members (user_id, organization_id, status, approved_at) VALUES ($1, $2, $3, $4) RETURNING *",
    [
      user_id,
      organization_id,
      status,
      status === "approved" ? new Date() : null,
    ]
  );
  return result.rows[0];
};

export const requestOrganizationJoin = async (user_id, organization_id) => {
  // Check for existing pending request
  const existing = await pool.query(
    `SELECT id FROM organization_members 
     WHERE user_id = $1 AND organization_id = $2 AND status = 'pending'`,
    [user_id, organization_id]
  );

  if (existing.rows.length > 0) {
    throw new Error("Join request already exists");
  }

  const result = await pool.query(
    `INSERT INTO organization_members (user_id, organization_id, status) 
     VALUES ($1, $2, 'pending')
     RETURNING *`,
    [user_id, organization_id]
  );
  return result.rows[0];
};

export const getOrganizationMembers = async (organization_id) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.username, u.email, u.role, om.status, om.requested_at, om.approved_at
       FROM organization_members om
       JOIN users u ON om.user_id = u.id
       WHERE om.organization_id = $1 AND om.status = 'approved'`,
      [organization_id]
    );
    return result.rows;
  } catch (error) {
    console.error("Error fetching organization members:", error);
    throw error;
  }
};

export const getOrganizationByCode = async (orgCode) => {
  const result = await pool.query(
    "SELECT * FROM organizations WHERE org_code = $1",
    [orgCode]
  );
  return result.rows[0];
};

export const getPendingJoinRequests = async (organization_id) => {
  const result = await pool.query(
    `SELECT om.*, u.username, u.email 
     FROM organization_members om
     JOIN users u ON om.user_id = u.id
     WHERE om.organization_id = $1 AND om.status = 'pending'`,
    [organization_id]
  );
  return result.rows;
};

export const updateOrganizationCode = async (orgId) => {
  const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  const result = await pool.query(
    `UPDATE organizations 
     SET org_code = $1, 
         code_expiration = NOW() + INTERVAL '1 minute'
     WHERE id = $2 
     RETURNING *`,
    [newCode, orgId]
  );
  return result.rows[0];
};
