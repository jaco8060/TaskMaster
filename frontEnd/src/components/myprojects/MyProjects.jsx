import axios from "axios";
import React, { useContext, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { AuthContext } from "../../contexts/AuthProvider.jsx";
import DataTable from "../../hooks/DataTable";
import { MainNav } from "../dashboard/NavBars.jsx";

const MyProjects = () => {
  const { user } = useContext(AuthContext); // Get the current logged-in user
  const columns = [
    { header: "Project Name", accessor: "name" },
    { header: "Description", accessor: "description" },
    { header: "Created At", accessor: "created_at" },
    { header: "Is Active", accessor: "is_active" },
  ];

  const searchFields = ["name", "description"];
  const endpoint = `${import.meta.env.VITE_URL}/projects?user_id=${user.id}`;

  const [showModal, setShowModal] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");

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
      // Reload the data table or trigger a refresh
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Failed to create project.");
    }
  };

  return (
    <MainNav>
      <div>
        <h1 className="mb-3">My Projects</h1>
        <Button variant="primary" onClick={handleShowModal}>
          Create Project
        </Button>
        <DataTable
          endpoint={endpoint}
          columns={columns}
          searchFields={searchFields}
        />
      </div>

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
