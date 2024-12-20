import {
  createTicket,
  deleteTicket,
  getTicketById,
  getTicketHistoryByTicketId,
  getTicketsByProjectId,
  getTicketsByUserId,
  updateTicket,
} from "../models/ticketModel.js";

export const handleGetTicketsByUserId = async (req, res) => {
  const userId = req.params.userId;
  try {
    const tickets = await getTicketsByUserId(userId);
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
    res.status(201).json(ticket);
  } catch (error) {
    console.error("Error creating ticket:", error);
    res.status(500).json({ error: "Server error" });
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
    const updatedTicket = await updateTicket(
      ticketId,
      title,
      description,
      status,
      priority,
      assigned_to,
      changed_by // Pass the user ID here
    );
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
// ticketController.js

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
