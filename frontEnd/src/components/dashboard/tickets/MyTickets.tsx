// MyTickets.tsx

import axios from "axios";
import { format } from "date-fns";
import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import { Button, Container, Form, Modal, Toast } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // Import useNavigate if not already imported
import { AuthContext, AuthContextType } from "../../../contexts/AuthProvider";
import DataTable from "../../../hooks/DataTable";
import "../../../styles/dashboard/MyTickets.scss";
import { MainNav } from "../NavBars";

interface Project {
  id: string;
  name: string;
}

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  project_id: string;
  created_at?: string;
}

const MyTickets: React.FC = () => {
  const { user } = useContext(AuthContext) as AuthContextType;
  const [projects, setProjects] = useState<Project[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newTicket, setNewTicket] = useState<Ticket>({
    id: "",
    title: "",
    description: "",
    status: "Open",
    priority: "Low",
    project_id: "",
  });
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"success" | "danger">(
    "success"
  );
  const navigate = useNavigate(); // Hook to navigate between routes

  const fetchProjects = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_URL}/projects/allForUser/${user?.id}`,
        { withCredentials: true }
      );
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setToastVariant("danger");
      setToastMessage("Failed to fetch projects");
      setShowToast(true);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchProjects();
    }
  }, [user?.id]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMMM d, yyyy h:mm a");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  const handleShowModal = () => {
    setIsEditMode(false);
    setNewTicket({
      id: "",
      title: "",
      description: "",
      status: "Open",
      priority: "Low",
      project_id: "",
    });
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleCreateTicket = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_URL}/tickets`,
        {
          ...newTicket,
          reported_by: user?.id,
          assigned_to: user?.id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      handleCloseModal();
      setRefresh(!refresh);
      setToastVariant("success");
      setToastMessage("Ticket created successfully");
      setShowToast(true);
    } catch (error) {
      console.error("Error creating ticket:", error);
      setToastVariant("danger");
      setToastMessage("Failed to create ticket");
      setShowToast(true);
    }
  };

  const handleUpdateTicket = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_URL}/tickets/${newTicket.id}`,
        {
          ...newTicket,
          reported_by: user?.id,
          assigned_to: user?.id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      handleCloseModal();
      setRefresh(!refresh);
    } catch (error) {
      console.error("Error updating ticket:", error);
      setToastVariant("danger");
      setToastMessage("Failed to update ticket.");
      setShowToast(true);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewTicket((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const columns = [
    { header: "Title", accessor: "title" },
    {
      header: "Description",
      accessor: "description",
      className: "description-column",
    },
    { header: "Status", accessor: "status" },
    { header: "Priority", accessor: "priority" },
    {
      header: "Created At",
      accessor: "created_at",
      className: "nowrap-column",
      type: "date" as "date",
    },
    {
      header: "",
      accessor: "actions",
      sortable: false,
    },
  ];

  const searchFields = ["title", "description", "status", "priority"];
  const endpoint = `${import.meta.env.VITE_URL}/tickets/user/${user?.id}`;

  const renderCell = (item: any, accessor: string) => {
    if (accessor === "created_at") {
      return formatDate(item[accessor]);
    } else if (accessor === "actions") {
      return (
        <div className="d-flex justify-content-end gap-2">
          {/* 
            Add a button similar to the 'My Projects' page:
            This "Ticket Details" button navigates the user to the ticket-details page for the given ticket ID.
          */}
          <Button
            variant="info"
            size="sm"
            onClick={() => navigate(`/ticket-details/${item.id}`)}
          >
            Ticket Details
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setIsEditMode(true);
              setNewTicket({
                id: item.id,
                title: item.title,
                description: item.description,
                status: item.status,
                priority: item.priority,
                project_id: item.project_id,
              });
              setShowModal(true);
            }}
          >
            Edit
          </Button>
        </div>
      );
    } else {
      return item[accessor];
    }
  };

  return (
    <MainNav>
      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={3000}
        autohide
        bg={toastVariant}
        className="position-fixed start-50 translate-middle-x"
        style={{ top: "70px" }}
      >
        <Toast.Header>
          <strong className="me-auto">
            {toastVariant === "success" ? "Success" : "Error"}
          </strong>
        </Toast.Header>
        <Toast.Body className="text-white">{toastMessage}</Toast.Body>
      </Toast>
      <div className="my-tickets-container">
        <Container fluid className=" section-container">
          <h1 className="mb-3">My Tickets</h1>
          <Button className="mb-3" onClick={handleShowModal}>
            Create New Ticket
          </Button>
          <div className="table-responsive-wrapper">
            <DataTable
              endpoint={endpoint}
              columns={columns}
              searchFields={searchFields}
              refresh={refresh}
              renderCell={renderCell}
            />
          </div>
          {/* Modal for creating/editing ticket */}
          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>
                {isEditMode ? "Edit Ticket" : "Create New Ticket"}
              </Modal.Title>
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
              {isEditMode ? (
                <Button
                  variant="primary"
                  onClick={handleUpdateTicket}
                  disabled={!newTicket.project_id}
                >
                  Save Changes
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleCreateTicket}
                  disabled={!newTicket.project_id}
                >
                  Create Ticket
                </Button>
              )}
            </Modal.Footer>
          </Modal>
        </Container>
      </div>
    </MainNav>
  );
};

export default MyTickets;
