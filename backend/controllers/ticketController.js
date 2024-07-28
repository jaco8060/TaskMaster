import {
  createTicket,
  deleteTicket,
  getTicketById,
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
  try {
    const updatedTicket = await updateTicket(
      ticketId,
      title,
      description,
      status,
      priority,
      assigned_to
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
