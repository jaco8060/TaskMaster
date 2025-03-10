import {
  createAttachment,
  deleteAttachment,
  getAttachmentsByTicketId,
  updateAttachmentDescription,
} from "../models/attachmentModel.js";
import { createNotification } from "../models/notificationModel.js";
import { getTicketById } from "../models/ticketModel.js";
import fs from "fs";
import path from "path";

export const handleCreateAttachment = async (req, res) => {
  const ticket_id = req.params.id;
  const { description } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  try {
    const attachment = await createAttachment(
      ticket_id,
      file.filename,
      description
    );

    // find ticket info for notifications
    const ticket = await getTicketById(ticket_id);

    if (ticket.assigned_to && ticket.reported_by) {
      await createNotification(
        ticket.assigned_to,
        `New attachment added to ticket "${ticket.title}" in project "${ticket.project_name}"`,
        ticket.id
      );
    } else if (ticket.assigned_to) {
      await createNotification(
        ticket.assigned_to,
        `New attachment added to ticket "${ticket.title}" in project "${ticket.project_name}"`,
        ticket.id
      );
    } else if (ticket.reported_by) {
      await createNotification(
        ticket.reported_by,
        `New attachment added to ticket "${ticket.title}" in project "${ticket.project_name}"`,
        ticket.id
      );
    }

    res.status(201).json(attachment);
  } catch (error) {
    console.error("Error creating attachment:", error);
    res.status(500).json({ error: "Failed to create attachment." });
  }
};

export const handleGetAttachments = async (req, res) => {
  const ticket_id = req.params.id;
  try {
    const attachments = await getAttachmentsByTicketId(ticket_id);
    res.status(200).json(attachments);
  } catch (error) {
    console.error("Error fetching attachments:", error);
    res.status(500).json({ error: "Failed to fetch attachments." });
  }
};

export const handleUpdateAttachmentDescription = async (req, res) => {
  const ticket_id = req.params.id;
  const attachmentId = req.params.attachmentId;
  const { description } = req.body;

  try {
    const updated = await updateAttachmentDescription(
      ticket_id,
      attachmentId,
      description
    );
    if (!updated) {
      return res.status(404).json({ error: "Attachment not found" });
    }
    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating attachment description:", error);
    res.status(500).json({ error: "Failed to update attachment description." });
  }
};
export const handleDeleteAttachment = async (req, res) => {
  const ticket_id = req.params.id;
  const attachmentId = req.params.attachmentId;
  try {
    const deleted = await deleteAttachment(ticket_id, attachmentId);
    if (!deleted) {
      return res.status(404).json({ error: "Attachment not found" });
    }

    // Delete the file from the server
    const filePath = path.join("uploads", deleted.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    } else {
      console.warn(`File not found: ${filePath}`);
    }

    res.status(200).json(deleted);
  } catch (error) {
    console.error("Error deleting attachment:", error);
    res.status(500).json({ error: "Failed to delete attachment." });
  }
};
