import axios from "axios";
import { format } from "date-fns";
import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Container,
  Form,
  Modal,
  Spinner,
  Table,
} from "react-bootstrap";
import { AuthContext } from "../../../contexts/AuthProvider.jsx";
import "../../../styles/dashboard/MyTickets.scss"; // Import your custom CSS file
import "../../../styles/hooks/DataTable.scss"; // Import your custom CSS file
import { MainNav } from "../NavBars.jsx";

const MyTickets = () => {
  const { user } = useContext(AuthContext); // Get the current logged-in user
  const [tickets, setTickets] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTicket, setNewTicket] = useState({
    title: "",
    description: "",
    status: "Open",
    priority: "Low",
    project_id: "",
  });

  const fetchTickets = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_URL}/tickets/user/${user.id}`,
        {
          withCredentials: true,
        }
      );
      setTickets(response.data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      alert("Failed to fetch tickets.");
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_URL}/projects/user/${user.id}`,
        {
          withCredentials: true,
        }
      );
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
      alert("Failed to fetch projects.");
    }
  };

  useEffect(() => {
    fetchTickets();
    fetchProjects();
  }, [user.id]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"; // Handle undefined or null dates
    try {
      return format(new Date(dateString), "MMMM d, yyyy h:mm a");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleCreateTicket = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_URL}/tickets`,
        {
          ...newTicket,
          reported_by: user.id,
          assigned_to: user.id, // Assuming the ticket is assigned to the user who creates it
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      fetchTickets(); // Refresh the tickets list
      handleCloseModal();
    } catch (error) {
      console.error("Error creating ticket:", error);
      alert("Failed to create ticket.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTicket((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  return (
    <MainNav>
      <Container className="p-0 m-0">
        <h1 className="mb-3">My Tickets</h1>
        <Button className="mb-3" onClick={handleShowModal}>
          Create New Ticket
        </Button>
        <div className="table-container">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Assigned At</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>{ticket.title}</td>
                  <td className="description-column">{ticket.description}</td>
                  <td>{ticket.status}</td>
                  <td>{ticket.priority}</td>
                  <td>{formatDate(ticket.assigned_at)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {/* Modal for creating new ticket */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Create New Ticket</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="ticketTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter title"
                  name="title"
                  value={newTicket.title}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="ticketDescription" className="mt-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter description"
                  name="description"
                  value={newTicket.description}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="ticketStatus" className="mt-3">
                <Form.Label>Status</Form.Label>
                <Form.Control
                  as="select"
                  name="status"
                  value={newTicket.status}
                  onChange={handleChange}
                  required
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
                  name="priority"
                  value={newTicket.priority}
                  onChange={handleChange}
                  required
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="ticketProject" className="mt-3">
                <Form.Label>Project</Form.Label>
                <Form.Control
                  as="select"
                  name="project_id"
                  value={newTicket.project_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">~Select Project~</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateTicket}
              disabled={!newTicket.project_id}
            >
              Create Ticket
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </MainNav>
  );
};

export default MyTickets;
