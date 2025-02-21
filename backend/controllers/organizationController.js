// backend/controllers/organizationController.js

import { pool } from "../database.js";
import { createNotification } from "../models/notificationModel.js";
import {
  addOrganizationMember,
  createOrganization,
  getOrganizationById,
  getOrganizationMembers,
  getPendingJoinRequests,
  requestOrganizationJoin,
  searchOrganizations,
  getOrganizationByCode,
} from "../models/organizationModel.js";
// Create a new organization; auto–add the creator as approved member
export const handleCreateOrganization = async (req, res) => {
  const { name } = req.body;
  const admin_id = req.user.id;
  try {
    const organization = await createOrganization(name, admin_id);
    // Add the creator as an approved member
    await addOrganizationMember(admin_id, organization.id, "approved");
    res.status(201).json(organization);
  } catch (error) {
    console.error("Error creating organization:", error);
    res.status(500).json({ error: "Failed to create organization" });
  }
};
export const handleGetMyOrganization = async (req, res) => {
  const organization_id = req.user.organization_id;
  if (!organization_id) {
    // Instead of a 404, return a 200 with organization set to null
    return res.status(200).json({ organization: null, members: [] });
  }
  try {
    const organization = await getOrganizationById(organization_id);
    const members = await getOrganizationMembers(organization_id);
    return res.status(200).json({ organization, members });
  } catch (error) {
    console.error("Error fetching organization data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
// Join an organization using a code
export const handleJoinWithCode = async (req, res) => {
  const { org_code } = req.body;
  const user_id = req.user.id;

  try {
    // First, verify the code and get organization
    const organization = await getOrganizationByCode(org_code);
    
    if (!organization) {
      return res.status(404).json({ error: "Invalid organization code" });
    }

    // Check if code is expired
    if (new Date() > new Date(organization.code_expiry)) {
      return res.status(400).json({ error: "Organization code has expired" });
    }

    // Add member to organization with explicit 'approved' status
    const membership = await addOrganizationMember(user_id, organization.id, 'approved');

    // Create notification for organization admin
    if (organization.admin_id) {
      await createNotification(
        organization.admin_id,
        `User ${req.user.username} has joined your organization using an invite code.`
      );
    }

    res.json({ 
      message: "Successfully joined organization",
      organization_id: organization.id 
    });

  } catch (error) {
    console.error("Error joining organization:", error);
    res.status(500).json({ error: "Failed to join organization" });
  }
};

// Search organizations
export const handleSearchOrganizations = async (req, res) => {
  const { searchTerm } = req.query;
  try {
    const organizations = await searchOrganizations(searchTerm || "");
    res.status(200).json(organizations);
  } catch (error) {
    console.error("Error searching organizations:", error);
    res.status(500).json({ error: "Failed to search organizations" });
  }
};

// Request to join an organization (pending approval)
export const handleRequestJoinOrganization = async (req, res) => {
  const { organization_id } = req.body;
  const user_id = req.user.id;
  
  try {
    const membership = await requestOrganizationJoin(user_id, organization_id);
    const organization = await getOrganizationById(organization_id);
    
    if (organization) {
      await createNotification(
        organization.admin_id,
        `User ${req.user.username} requested to join your organization.`
      );
    }
    res.status(200).json({ message: "Join request submitted", membership });
    
  } catch (error) {
    if (error.message.includes('already exists')) {
      return res.status(409).json({ error: error.message });
    }
    console.error("Error requesting to join organization:", error);
    res.status(500).json({ error: "Failed to request joining organization" });
  }
};

export const handlePostRegisterJoinRequest = async (req, res) => {
  const { user_id, organization_id } = req.body;
  try {
    const membership = await requestOrganizationJoin(user_id, organization_id);
    const organization = await getOrganizationById(organization_id);

    if (organization) {
      await createNotification(
        organization.admin_id,
        `New user requested to join your organization`
      );
    }

    res.status(200).json({
      message: "Join request submitted",
      membership,
    });
  } catch (error) {
    console.error("Error submitting post-registration request:", error);
    res.status(500).json({ error: "Failed to submit request" });
  }
};

export const handleProcessJoinRequest = async (req, res) => {
  const { user_id, organization_id, status } = req.body;
  try {
    // Add input validation and parsing
    const user_id_int = parseInt(user_id, 10);
    const organization_id_int = parseInt(organization_id, 10);
    const status_lower = status.toLowerCase();

    if (isNaN(user_id_int) || isNaN(organization_id_int) || !status_lower) {
      return res.status(400).json({ error: "Invalid parameters" });
    }

    const organization = await getOrganizationById(organization_id_int);
    if (!organization || organization.admin_id !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      if (status_lower === "approved") {
        // Update member status to approved
        const updateResult = await client.query(
          `UPDATE organization_members 
           SET status = 'approved', approved_at = NOW() 
           WHERE user_id = $1 AND organization_id = $2
           RETURNING *`, // Removed status check to handle any state
          [user_id_int, organization_id_int]
        );

        if (updateResult.rowCount === 0) {
          await client.query("ROLLBACK");
          return res.status(404).json({ error: "Member record not found" });
        }

        // Update user's organization reference
        await client.query(
          `UPDATE users SET organization_id = $1 WHERE id = $2`,
          [organization_id_int, user_id_int]
        );
      } else {
        // Update status to rejected instead of deleting
        const updateResult = await client.query(
          `UPDATE organization_members 
           SET status = 'rejected'
           WHERE user_id = $1 AND organization_id = $2
           RETURNING *`,
          [user_id_int, organization_id_int]
        );

        if (updateResult.rowCount === 0) {
          await client.query("ROLLBACK");
          return res.status(404).json({ error: "Member record not found" });
        }
      }

      await client.query("COMMIT");

      // Notify user
      await createNotification(
        user_id_int,
        `Organization join request ${status_lower}`
      );

      res.status(200).json({ message: `Request ${status_lower}` });
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Transaction error:", error);
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const handleGetPendingRequests = async (req, res) => {
  try {
    const organization = await getOrganizationById(req.params.id);

    if (!organization || organization.admin_id !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const requests = await getPendingJoinRequests(req.params.id);
    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching pending requests:", error);
    res.status(500).json({ error: "Failed to fetch pending requests" });
  }
};

export const handleRemoveOrganizationMember = async (req, res) => {
  const { orgId, userId } = req.params;

  try {
    const organization = await getOrganizationById(orgId);
    if (!organization || organization.admin_id !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await pool.query(
      "DELETE FROM organization_members WHERE organization_id = $1 AND user_id = $2",
      [orgId, userId]
    );

    res.status(200).json({ message: "Member removed successfully" });
  } catch (error) {
    console.error("Error removing member:", error);
    res.status(500).json({ error: "Failed to remove member" });
  }
};

export const handleGetOrganizationStatus = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT om.status 
       FROM organization_members om
       WHERE om.user_id = $1`,
      [req.user.id]
    );
    
    const status = rows[0]?.status || 'none';
    res.json({ status });
  } catch (error) {
    console.error("Error getting organization status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const handleCancelJoinRequest = async (req, res) => {
  try {
    await pool.query(
      `DELETE FROM organization_members 
       WHERE user_id = $1 AND status = 'pending'`,
      [req.user.id]
    );
    res.status(204).end();
  } catch (error) {
    console.error("Error canceling join request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const handleValidateOrgCode = async (req, res) => {
  const { code } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM organizations WHERE org_code = $1",
      [code]
    );
    
    const isValid = result.rows.length > 0;
    res.json({ valid: isValid });
  } catch (error) {
    console.error("Error validating organization code:", error);
    res.status(500).json({ error: "Failed to validate organization code" });
  }
};

