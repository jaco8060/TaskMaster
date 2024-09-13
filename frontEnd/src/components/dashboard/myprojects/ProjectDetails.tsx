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
        alert("Failed to fetch project details.");
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
        alert("Failed to fetch assigned personnel.");
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
    } catch (error) {
      console.error("Error updating project:", error);
      alert("Failed to update project.");
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
      renderCell: (item: Personnel) => formatDate(item.assigned_at),
    },
  ];

  return (
    <MainNav>
      <div className="d-flex flex-column">
        <Row>
          <Col>
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
                  className="ms-2 "
                >
                  Edit Project
                </Button>
              </div>
            </div>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col>
            <h2>Assigned Personnel</h2>
            <DataTable
              endpoint={`${import.meta.env.VITE_URL}/projects/${id}/personnel`}
              columns={personnelColumns}
              searchFields={["username", "email"]}
              renderCell={(item: Personnel, accessor: string) => {
                // Cast accessor to keyof Personnel when needed
                if (accessor === "assigned_at") {
                  return formatDate(item[accessor as keyof Personnel]);
                }
                return item[accessor as keyof Personnel];
              }}
            />
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
