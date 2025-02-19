import { pool } from "../database.js";

export const createOrganization = async (name, admin_id) => {
  // Generate a random organization code (e.g., 6–character uppercase string)
  const org_code = Math.random().toString(36).substring(2, 8).toUpperCase();
  // Set expiration 7 days from now
  const code_expiration = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const result = await pool.query(
    "INSERT INTO organizations (name, org_code, code_expiration, admin_id) VALUES ($1, $2, $3, $4) RETURNING *",
    [name, org_code, code_expiration, admin_id]
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
    "SELECT * FROM organizations WHERE name ILIKE $1",
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
  const result = await pool.query(
    "INSERT INTO organization_members (user_id, organization_id, status) VALUES ($1, $2, 'pending') RETURNING *",
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
       WHERE om.organization_id = $1`,
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
