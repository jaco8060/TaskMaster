import {
  createAttachment,
  getAttachmentsByTicketId,
  updateAttachmentDescription,
} from "../models/attachmentModel.js";

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
