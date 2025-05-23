import axios from "axios";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Spinner,
  Toast,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import DataTable from "../../../hooks/DataTable";
import { MainNav } from "../NavBars";

// Define types for Project and Personnel
interface Project {
  id: string;
  name: string;
  description: string;
  created_at: string;
  is_active: boolean;
}

interface Personnel {
  id: string;
  username: string;
  email: string;
  assigned_at: string;
}

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  created_at: string;
}

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the project ID from the URL
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [projectName, setProjectName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"success" | "danger">(
    "success"
  );

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_URL}/projects/${id}`,
          { withCredentials: true }
        );
        setProject(response.data);
        setProjectName(response.data.name);
        setDescription(response.data.description);
        setIsActive(response.data.is_active);
      } catch (error) {
        console.error("Error fetching project details:", error);
        setToastVariant("danger");
        setToastMessage("Failed to fetch project details");
        setShowToast(true);
      } finally {
        setLoading(false);
      }
    };

    const fetchAssignedPersonnel = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_URL}/projects/${id}/personnel`,
          { withCredentials: true }
        );
        setPersonnel(response.data);
      } catch (error) {
        console.error("Error fetching assigned personnel:", error);
        setToastVariant("danger");
        setToastMessage("Failed to fetch assigned personnel");
        setShowToast(true);
      }
    };

    fetchProjectDetails();
    fetchAssignedPersonnel();
  }, [id]);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleUpdateProject = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_URL}/projects/${id}`,
        {
          name: projectName,
          description,
          is_active: isActive,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      setShowModal(false);
      setProject((prevProject) => ({
        ...prevProject!,
        name: projectName,
        description,
        is_active: isActive,
      }));
      setToastVariant("success");
      setToastMessage("Project updated successfully");
      setShowToast(true);
    } catch (error) {
      console.error("Error updating project:", error);
      setToastVariant("danger");
      setToastMessage("Failed to update project");
      setShowToast(true);
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMMM d, yyyy h:mm a");
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

  if (!project) {
    return (
      <MainNav>
        <Container>
          <h1>Project not found</h1>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </Container>
      </MainNav>
    );
  }

  const personnelColumns = [
    { header: "Username", accessor: "username" },
    { header: "Email", accessor: "email" },
    {
      header: "Assigned At",
      accessor: "assigned_at",
      type: "date" as const,
    },
  ];

  const ticketColumns = [
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
      type: "date" as const,
    },
    {
      header: "",
      accessor: "actions",
      sortable: false,
    },
  ];

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
      <div className="d-flex flex-column">
        <Row>
          <Col>
            <div className="section-container">
              <div className="d-flex flex-column align-items-left fs-5">
                <h2 className="fs-2">Project Details</h2>
                <p>
                  <strong>Project Name:</strong> {project.name}
                </p>
                <p>
                  <strong>Description:</strong> {project.description}
                </p>
                <p>
                  <strong>Created At:</strong> {formatDate(project.created_at)}
                </p>
                <p>
                  <strong>Is Active:</strong> {project.is_active ? "Yes" : "No"}
                </p>
                <div>
                  <Button variant="primary" onClick={() => navigate(-1)}>
                    Go Back
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleShowModal}
                    className="ms-2"
                  >
                    Edit Project
                  </Button>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col>
            <div className="section-container">
              <h2>Assigned Personnel</h2>
              <DataTable
                endpoint={`${
                  import.meta.env.VITE_URL
                }/projects/${id}/personnel`}
                columns={personnelColumns}
                searchFields={["username", "email"]}
                renderCell={(item: Personnel, accessor: string) => {
                  if (accessor === "assigned_at") {
                    return formatDate(item[accessor as keyof Personnel]);
                  }
                  return item[accessor as keyof Personnel];
                }}
              />
            </div>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col>
            <div className="section-container">
              <h2>Project Tickets</h2>
              <DataTable
                endpoint={`${import.meta.env.VITE_URL}/tickets/project/${id}`}
                columns={ticketColumns}
                searchFields={["title", "description", "status", "priority"]}
                renderCell={(item: Ticket, accessor: string) => {
                  if (accessor === "actions") {
                    return (
                      <div className="d-flex justify-content-end gap-2">
                        <Button
                          variant="info"
                          size="sm"
                          onClick={() => navigate(`/ticket-details/${item.id}`)}
                        >
                          Ticket Details
                        </Button>
                      </div>
                    );
                  }
                  if (accessor === "created_at") {
                    return formatDate(item[accessor as keyof Ticket]);
                  }
                  return item[accessor as keyof Ticket];
                }}
              />
            </div>
          </Col>
        </Row>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="projectName">
              <Form.Label>Project Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter project name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="description" className="mt-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter project description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="isActive" className="mt-3">
              <Form.Check
                type="checkbox"
                label="Is Active"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateProject}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </MainNav>
  );
};

export default ProjectDetails;
