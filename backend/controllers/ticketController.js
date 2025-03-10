import { meiliClient } from "../meilisearch.js";
import { createNotification } from "../models/notificationModel.js";
import {
  assignUsersToTicket,
  createTicket,
  deleteTicket,
  getTicketById,
  getTicketHistoryByTicketId,
  getTicketsByProjectId,
  getTicketsByUserId,
  updateTicket,
} from "../models/ticketModel.js";
import { getProjectById } from "../models/projectModel.js";

export const handleGetTicketsByUserId = async (req, res) => {
  // Ensure user is authenticated
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userId = req.params.userId;
  const organizationId = req.user.organization_id;
  
  try {
    const tickets = await getTicketsByUserId(userId, organizationId);
    res.status(200).json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const handleCreateTicket = async (req, res) => {
  const {
    title,
    description,
    status,
    priority,
    project_id,
    reported_by,
    assigned_to,
  } = req.body;
  try {
    const ticket = await createTicket(
      title,
      description,
      status,
      priority,
      project_id,
      reported_by,
      assigned_to
    );
    await meiliClient.index("tickets").addDocuments([
      {
        id: ticket.id,
        title: ticket.title,
        description: ticket.description,
        project_id: ticket.project_id,
        assigned_to: ticket.assigned_to,
        reported_by: ticket.reported_by,
      },
    ]);
    if (assigned_to) {
      await createNotification(
        assigned_to,
        `You've been assigned to ticket: "${title}"`,
        ticket.id
      );
    }
    res.status(201).json(ticket);
  } catch (error) {
    console.error("Error creating ticket:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const indexTicket = async (ticket) => {
  try {
    const project = await getProjectById(ticket.project_id);
    if (!project) {
      console.error(`Project not found for ticket ${ticket.id}`);
      return;
    }
    await meiliClient.index("tickets").addDocuments([
      {
        id: ticket.id,
        title: ticket.title,
        description: ticket.description,
        project_id: ticket.project_id,
        assigned_to: ticket.assigned_to,
        reported_by: ticket.reported_by,
        organization_id: project.organization_id,
      },
    ]);
  } catch (error) {
    console.error("Error indexing ticket:", error);
  }
};

export const handleGetTicketsByProjectId = async (req, res) => {
  const projectId = req.params.projectId;
  try {
    const tickets = await getTicketsByProjectId(projectId);
    res.status(200).json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const handleGetTicketById = async (req, res) => {
  const ticketId = req.params.id;
  try {
    const ticket = await getTicketById(ticketId);
    res.status(200).json(ticket);
  } catch (error) {
    console.error("Error fetching ticket:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const handleUpdateTicket = async (req, res) => {
  const ticketId = req.params.id;
  const { title, description, status, priority, assigned_to } = req.body;

  // This requires the route to be protected by ensureAuthenticated
  // so that req.user is defined.
  const changed_by = req.user.id;

  try {
    const oldTicket = await getTicketById(ticketId);
    const oldAssignedTo = oldTicket.assigned_to;
    const updatedTicket = await updateTicket(
      ticketId,
      title,
      description,
      status,
      priority,
      assigned_to,
      changed_by // Pass the user ID here
    );

    // Only handle ticket assignment changes
    if (
      updatedTicket.assigned_to &&
      updatedTicket.assigned_to !== oldAssignedTo
    ) {
      await createNotification(
        updatedTicket.assigned_to,
        `You've been assigned to ticket: "${updatedTicket.title}"`,
        ticketId
      );
    }

    res.status(200).json(updatedTicket);
  } catch (error) {
    console.error("Error updating ticket:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const handleDeleteTicket = async (req, res) => {
  const ticketId = req.params.id;
  try {
    const deletedTicket = await deleteTicket(ticketId);
    if (!deletedTicket) {
      return res.status(404).json({ error: "Ticket not found" });
    }
    res.status(200).json(deletedTicket);
  } catch (error) {
    console.error("Error deleting ticket:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const handleGetTicketHistory = async (req, res) => {
  const ticketId = req.params.id;
  try {
    const history = await getTicketHistoryByTicketId(ticketId);
    // history is already in the form {property, old_value, new_value, changed_at, changed_by_username}
    const formatted = history.map((h) => ({
      property: h.property,
      old_value: h.old_value,
      new_value: h.new_value,
      changed_by: h.changed_by_username || "Unknown",
      changed_at: new Date(h.changed_at).toLocaleString(),
    }));
    res.status(200).json(formatted);
  } catch (error) {
    console.error("Error fetching ticket history:", error);
    res.status(500).json({ error: "Failed to fetch ticket history." });
  }
};

export const handleAssignUsers = async (req, res) => {
  const ticketId = req.params.id;
  const { userIds } = req.body; // array of user IDs
  try {
    const assigned = await assignUsersToTicket(ticketId, userIds);

    // notify each assigned user
    for (const row of assigned) {
      await createNotification(
        row.user_id,
        `You have been assigned to ticket (#${ticketId}).`
      );
    }

    res.status(201).json(assigned);
  } catch (error) {
    console.error("Error assigning multiple users to ticket:", error);
    res.status(500).json({ error: "Server error" });
  }
};
