import axios from "axios";
import { format } from "date-fns";
import React, { useContext, useState } from "react";
import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthProvider";
import DataTable from "../../../hooks/DataTable";
import "../../../styles/dashboard/MyProjects.scss"; // Import the custom CSS file
import { MainNav } from "../NavBars";

// Define types for project and user
interface Project {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

interface User {
  id: number;
  role: string;
  username: string;
  email: string;
}

// Add this interface at the top with your other interfaces
interface Column {
  header: string;
  accessor: string;
  type?: "string" | "number" | "date";
  sortable?: boolean;
}

const MyProjects: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext) as { user: User }; // Get the current logged-in user with type

  const columns: Column[] = [
    { header: "Name", accessor: "name" },
    { header: "Description", accessor: "description" },
    {
      header: "Created At",
      accessor: "created_at",
      type: "date",
    },
    {
      header: "",
      accessor: "details",
      sortable: false,
    },
  ];

  const searchFields = ["name", "description"];
  const endpoint = `${import.meta.env.VITE_URL}/projects/user/${user.id}`;

  const [showModal, setShowModal] = useState<boolean>(false);
  const [projectName, setProjectName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [refresh, setRefresh] = useState<boolean>(false); // State to handle refresh

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleCreateProject = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_URL}/projects`,
        {
          name: projectName,
          description,
          user_id: user.id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      handleCloseModal();
      setRefresh((prev) => !prev); // Trigger refresh
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Failed to create project.");
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMMM d, yyyy h:mm a");
  };

  return (
    <MainNav>
      <Container className="p-0 m-0 d-flex flex-column">
        <Row>
          <Col>
            <h1 className="mb-3">My Projects</h1>
          </Col>
        </Row>
        <Row>
          <Col xs={6} sm={6} className="ml-1">
            <Button
              className="mb-3"
              variant="primary"
              onClick={handleShowModal}
            >
              Create Project
            </Button>
          </Col>
        </Row>
        <Row className="dataTable">
          <Col xs={12} sm={12}>
            <DataTable
              key={refresh ? "refresh-true" : "refresh-false"} // Ensure a string key
              endpoint={endpoint}
              columns={columns}
              searchFields={searchFields}
              renderCell={(item, accessor) => {
                if (accessor === "details") {
                  return (
                    <div className="d-flex justify-content-end gap-2">
                      <Button
                        variant="info"
                        size="sm"
                        className="py-1"
                        onClick={() => navigate(`/project-details/${item.id}`)}
                      >
                        Details
                      </Button>
                      {(user.role === "admin" || user.role === "pm") && (
                        <Button
                          variant="primary"
                          size="sm"
                          className="py-1"
                          onClick={() =>
                            navigate(`/assign-personnel/${item.id}`)
                          }
                        >
                          Assign
                        </Button>
                      )}
                    </div>
                  );
                }
                if (accessor === "created_at") {
                  return formatDate(item[accessor]);
                }
                return item[accessor];
              }}
            />
          </Col>
        </Row>
      </Container>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create Project</Modal.Title>
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
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateProject}>
            Create Project
          </Button>
        </Modal.Footer>
      </Modal>
    </MainNav>
  );
};

export default MyProjects;
