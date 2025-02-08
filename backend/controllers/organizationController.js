import { createNotification } from "../models/notificationModel.js";
import {
  addOrganizationMember,
  createOrganization,
  getOrganizationById,
  requestOrganizationJoin,
  searchOrganizations,
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

// Join an organization using a code
export const handleJoinOrganizationWithCode = async (req, res) => {
  const { organization_id, org_code } = req.body;
  const user_id = req.user.id;
  try {
    const organization = await getOrganizationById(organization_id);
    if (!organization) {
      return res.status(404).json({ error: "Organization not found" });
    }
    if (
      organization.org_code !== org_code ||
      new Date(organization.code_expiration) < new Date()
    ) {
      return res
        .status(400)
        .json({ error: "Invalid or expired organization code" });
    }
    // Add user as approved member
    const membership = await addOrganizationMember(
      user_id,
      organization_id,
      "approved"
    );
    await createNotification(
      organization.admin_id,
      `User ${req.user.username} joined your organization.`
    );
    res
      .status(200)
      .json({ message: "Joined organization successfully", membership });
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
    console.error("Error requesting to join organization:", error);
    res.status(500).json({ error: "Failed to request joining organization" });
  }
};
