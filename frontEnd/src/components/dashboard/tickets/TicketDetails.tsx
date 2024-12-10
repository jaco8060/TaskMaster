// TicketDetails.tsx

import axios from "axios";
import { format } from "date-fns";
import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { MainNav } from "../NavBars";
import CommentsSection from "./CommentsSection.tsx";

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  project_id: string;
  project_name: string;
  assigned_to: string;
  assigned_to_name: string;
  reported_by: string;
  reported_by_name: string;
  created_at: string;
  updated_at: string;
}

// Define types for attachments
interface Attachment {
  id: number;
  filename: string;
  description: string;
  uploaded_at: string;
}

// Add a modal state for editing attachment description
interface AttachmentToEdit {
  id: number;
  description: string;
}

const TicketDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTicket, setEditTicket] = useState<Ticket | null>(null);
  const [refresh, setRefresh] = useState(false);

  // Attachments state
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [attachmentDescription, setAttachmentDescription] = useState("");

  // Modal for editing attachment description
  const [showEditAttachmentModal, setShowEditAttachmentModal] = useState(false);
  const [attachmentToEdit, setAttachmentToEdit] =
    useState<AttachmentToEdit | null>(null);

  const fetchTicketDetails = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_URL}/tickets/${id}`,
        { withCredentials: true }
      );
      setTicket(response.data);
    } catch (error) {
      console.error("Error fetching ticket details:", error);
      alert("Failed to fetch ticket details.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch attachments function
  const fetchAttachments = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_URL}/tickets/${id}/attachments`,
        { withCredentials: true }
      );
      setAttachments(response.data);
    } catch (error) {
      console.error("Error fetching attachments:", error);
      alert("Failed to fetch attachments.");
    }
  };

  useEffect(() => {
    fetchTicketDetails();
    fetchAttachments();
  }, [id, refresh]);

  const handleUpdateTicket = async () => {
    if (!editTicket) return;

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_URL}/tickets/${id}`,
        editTicket,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setTicket(response.data);
      setShowModal(false);
    } catch (error) {
      console.error("Error updating ticket:", error);
      alert("Failed to update ticket.");
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "MMMM d, yyyy h:mm a");
  };

  const handleAddAttachment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!attachmentFile) {
      alert("Please choose a file to attach");
      return;
    }

    const formData = new FormData();
    formData.append("attachment", attachmentFile);
    formData.append("description", attachmentDescription);

    try {
      await axios.post(
        `${import.meta.env.VITE_URL}/tickets/${id}/attachments`,
        formData,
        {
          withCredentials: true,
        }
      );
      // Reset form states
      setAttachmentFile(null);
      setAttachmentDescription("");
      setRefresh(!refresh);
    } catch (error) {
      console.error("Error uploading attachment:", error);
      alert("Failed to upload attachment.");
    }
  };

  const handleEditAttachmentDescription = async () => {
    if (!attachmentToEdit) return;
    try {
      await axios.put(
        `${import.meta.env.VITE_URL}/tickets/${id}/attachments/${
          attachmentToEdit.id
        }`,
        { description: attachmentToEdit.description },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setShowEditAttachmentModal(false);
      setAttachmentToEdit(null);
      setRefresh(!refresh);
    } catch (error) {
      console.error("Error updating attachment description:", error);
      alert("Failed to update attachment description.");
    }
  };

  if (loading) {
    return (
      <MainNav>
        <Container
          className="d-flex justify-content-center align-items-center"
          style={{ height: "100vh" }}
        >
          <Spinner animation="border" />
        </Container>
      </MainNav>
    );
  }

  if (!ticket) {
    return (
      <MainNav>
        <Container>
          <h1>Ticket not found</h1>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </Container>
      </MainNav>
    );
  }

  return (
    <MainNav>
      <div className="d-flex flex-column">
        <Row>
          <Col md={6}>
            <div className="d-flex flex-column align-items-left fs-5">
              <h2 className="fs-2">Ticket Details</h2>
              <div className="mb-3">
                <Button variant="primary" onClick={() => navigate(-1)}>
                  Go Back
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setEditTicket(ticket);
                    setShowModal(true);
                  }}
                  className="ms-2"
                >
                  Edit Ticket
                </Button>
              </div>
              <Table striped bordered className="ticket-details-table">
                <tbody>
                  <tr>
                    <th>Title</th>
                    <td>{ticket.title}</td>
                  </tr>
                  <tr>
                    <th>Description</th>
                    <td>{ticket.description}</td>
                  </tr>
                  <tr>
                    <th>Assigned Developer</th>
                    <td>{ticket.assigned_to_name}</td>
                  </tr>
                  <tr>
                    <th>Submitter</th>
                    <td>{ticket.reported_by_name}</td>
                  </tr>
                  <tr>
                    <th>Project</th>
                    <td>{ticket.project_name}</td>
                  </tr>
                  <tr>
                    <th>Priority</th>
                    <td>{ticket.priority}</td>
                  </tr>
                  <tr>
                    <th>Status</th>
                    <td>{ticket.status}</td>
                  </tr>
                  <tr>
                    <th>Created</th>
                    <td>{formatDate(ticket.created_at)}</td>
                  </tr>
                  <tr>
                    <th>Updated</th>
                    <td>{formatDate(ticket.updated_at)}</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </Col>
          <Col md={4}>
            {/* Conditionally Render Comments Section */}
            <CommentsSection ticketId={id!} />
          </Col>
        </Row>

        {/* Attachment upload section */}
        <Row className="mt-4">
          <Col md={6}>
            <h3>Attachments</h3>
            <Form onSubmit={handleAddAttachment}>
              <Form.Group controlId="attachmentFile" className="mb-3">
                <Form.Label>Select Attachment File</Form.Label>
                <Form.Control
                  type="file"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const fileInput = e.target;
                    setAttachmentFile(
                      fileInput.files && fileInput.files.length > 0
                        ? fileInput.files[0]
                        : null
                    );
                  }}
                />
              </Form.Group>
              <Form.Group controlId="attachmentDescription" className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter attachment description"
                  value={attachmentDescription}
                  onChange={(e) => setAttachmentDescription(e.target.value)}
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Upload Attachment
              </Button>
            </Form>

            {/* Attachment list */}
            {attachments.length > 0 ? (
              <Table striped bordered hover className="mt-3">
                <thead>
                  <tr>
                    <th>Filename</th>
                    <th>Description</th>
                    <th>Uploaded At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {attachments.map((att) => (
                    <tr key={att.id}>
                      <td>{att.filename}</td>
                      <td>{att.description}</td>
                      <td>{formatDate(att.uploaded_at)}</td>
                      <td>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setAttachmentToEdit({
                              id: att.id,
                              description: att.description,
                            });
                            setShowEditAttachmentModal(true);
                          }}
                        >
                          Edit Description
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p className="fst-italic mt-2">No attachments yet.</p>
            )}
          </Col>
        </Row>

        {/* Modal for editing ticket details */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Ticket</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="ticketTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  value={editTicket?.title || ""}
                  onChange={(e) =>
                    setEditTicket((prev) => ({
                      ...prev!,
                      title: e.target.value,
                    }))
                  }
                />
              </Form.Group>
              <Form.Group controlId="ticketDescription" className="mt-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={editTicket?.description || ""}
                  onChange={(e) =>
                    setEditTicket((prev) => ({
                      ...prev!,
                      description: e.target.value,
                    }))
                  }
                />
              </Form.Group>
              <Form.Group controlId="ticketStatus" className="mt-3">
                <Form.Label>Status</Form.Label>
                <Form.Control
                  as="select"
                  value={editTicket?.status || "Open"}
                  onChange={(e) =>
                    setEditTicket((prev) => ({
                      ...prev!,
                      status: e.target.value,
                    }))
                  }
                >
                  <option>Open</option>
                  <option>In Progress</option>
                  <option>Closed</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="ticketPriority" className="mt-3">
                <Form.Label>Priority</Form.Label>
                <Form.Control
                  as="select"
                  value={editTicket?.priority || "Low"}
                  onChange={(e) =>
                    setEditTicket((prev) => ({
                      ...prev!,
                      priority: e.target.value,
                    }))
                  }
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </Form.Control>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleUpdateTicket}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal for editing attachment description */}
        <Modal
          show={showEditAttachmentModal}
          onHide={() => setShowEditAttachmentModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit Attachment Description</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {attachmentToEdit && (
              <Form.Group controlId="attachmentEditDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  value={attachmentToEdit.description}
                  onChange={(e) =>
                    setAttachmentToEdit((prev) =>
                      prev ? { ...prev, description: e.target.value } : null
                    )
                  }
                />
              </Form.Group>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowEditAttachmentModal(false)}
            >
              Close
            </Button>
            <Button variant="primary" onClick={handleEditAttachmentDescription}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </MainNav>
  );
};

export default TicketDetails;
