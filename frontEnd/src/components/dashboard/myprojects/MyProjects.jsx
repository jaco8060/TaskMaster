import axios from "axios";
import {
  differenceInDays,
  format,
  isToday,
  isYesterday,
  parseISO,
} from "date-fns";
import React, { useContext, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthProvider.jsx";
import DataTable from "../../../hooks/DataTable.jsx";
import "../../../styles/dashboard/MyProjects.scss"; // Import the custom CSS file
import { MainNav } from "../NavBars.jsx";

const MyProjects = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // Get the current logged-in user
  const columns = [
    { header: "Project Name", accessor: "name" },
    { header: "Description", accessor: "description" },
    { header: "Created At", accessor: "created_at" },
    { header: "", accessor: "details" }, // Empty header for the details column
  ];

  const searchFields = ["name", "description"];
  const endpoint = `${import.meta.env.VITE_URL}/projects?user_id=${user.id}`;

  const [showModal, setShowModal] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [refresh, setRefresh] = useState(false); // State to handle refresh

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

  const formatDate = (dateString) => {
    const date = parseISO(dateString);
    const now = new Date();
    if (isToday(date)) {
      return `Today ${format(date, "h:mm aa")}`;
    } else if (isYesterday(date)) {
      return `Yesterday ${format(date, "h:mm aa")}`;
    } else if (differenceInDays(now, date) <= 7) {
      return `${differenceInDays(now, date)}d ago ${format(date, "h:mm aa")}`;
    } else {
      return format(date, "M-d-yyyy h:mm aa");
    }
  };

  return (
    <MainNav>
      <div>
        <h1 className="mb-3">My Projects</h1>
        <Button className="mb-3" variant="primary" onClick={handleShowModal}>
          Create Project
        </Button>
        <DataTable
          key={refresh} // Add the refresh key
          endpoint={endpoint}
          columns={columns}
          searchFields={searchFields}
          renderCell={(item, accessor) => {
            if (accessor === "details") {
              return (
                <div className="details-cell-container">
                  <ul className="details-cell">
                    <li>
                      <Button
                        variant="link"
                        onClick={() => navigate(`/project-details/${item.id}`)}
                      >
                        Details
                      </Button>
                    </li>
                    <li>
                      {(user.role === "admin" || user.role === "pm") && (
                        <Button
                          variant="link"
                          onClick={() =>
                            navigate(`/assign-personnel/${item.id}`)
                          }
                        >
                          Assign Personnel
                        </Button>
                      )}
                    </li>
                  </ul>
                </div>
              );
            }
            if (accessor === "created_at") {
              return formatDate(item[accessor]);
            }
            return item[accessor];
          }}
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
