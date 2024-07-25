import axios from "axios";
import { format } from "date-fns";
import React, { useContext, useEffect, useState } from "react";
import { Button, Col, Container, Modal, Row, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthProvider.jsx";
import DataTable from "../../../hooks/DataTable.jsx";
import UserSelector from "../../../hooks/UserSelector.jsx";
import { MainNav } from "../NavBars.jsx";

const AssignPersonnel = () => {
  const { id } = useParams(); // Get the project ID from the URL
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false); // State to trigger DataTable refresh
  const [showModal, setShowModal] = useState(false); // State to handle modal visibility
  const [selectedUser, setSelectedUser] = useState(null); // State to track the user being deleted

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_URL}/projects/${id}`,
          {
            withCredentials: true,
          }
        );
        setProject(response.data);
      } catch (error) {
        console.error("Error fetching project details:", error);
        alert("Failed to fetch project details.");
      }
      setLoading(false);
    };

    fetchProjectDetails();
  }, [id]);

  const handleAssignPersonnel = async (userIds) => {
    try {
      const promises = userIds.map((userId) =>
        axios.post(
          `${import.meta.env.VITE_URL}/projects/${id}/personnel`,
          { userId },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        )
      );

      await Promise.all(promises);

      setRefresh(!refresh); // Trigger DataTable refresh
    } catch (error) {
      console.error("Error assigning personnel:", error);
      alert("Failed to assign personnel.");
    }
  };

  const handleRemovePersonnel = async () => {
    if (!selectedUser) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_URL}/projects/${id}/personnel/${
          selectedUser.id
        }`,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      setRefresh(!refresh); // Trigger DataTable refresh
      setShowModal(false); // Close the modal
      setSelectedUser(null); // Reset the selected user
    } catch (error) {
      console.error("Error removing personnel:", error);
      alert("Failed to remove personnel.");
    }
  };

  const formatDate = (dateString) => {
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
          <Button onClick={() => navigate("myprojects")}>Go Back</Button>
        </Container>
      </MainNav>
    );
  }

  const personnelColumns = [
    { header: "Username", accessor: "username" },
    { header: "Email", accessor: "email" },
    { header: "Role", accessor: "role" },
    {
      header: "Assigned At",
      accessor: "assigned_at",
      renderCell: (item) => formatDate(item.assigned_at),
    },
    {
      header: "",
      accessor: "actions",
      renderCell: (item) => (
        <Button
          variant="danger"
          onClick={() => {
            setSelectedUser(item);
            setShowModal(true);
          }}
        >
          Remove
        </Button>
      ),
    },
  ];

  return (
    <MainNav>
      <div className="d-flex flex-column">
        <Row>
          <Col>
            <h1 className="mb-3">Assign Personnel</h1>
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
            <Button
              variant="primary"
              className="mb-3"
              onClick={() => navigate(`/myprojects`)}
            >
              Go back
            </Button>
            <UserSelector
              endpoint={`${import.meta.env.VITE_URL}/users`}
              onAssign={handleAssignPersonnel}
            />
          </Col>
        </Row>
        <Row className="mt-4">
          <Col>
            <h2>Assigned Personnel</h2>
            <DataTable
              endpoint={`${import.meta.env.VITE_URL}/projects/${id}/personnel`}
              columns={personnelColumns}
              searchFields={["username", "email", "role"]}
              refresh={refresh} // Use the refresh state to trigger DataTable refresh
              renderCell={(item, accessor) => {
                if (accessor === "actions") {
                  return (
                    <div className="d-flex justify-content-end">
                      <Button
                        variant="danger"
                        onClick={() => {
                          setSelectedUser(item);
                          setShowModal(true);
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  );
                }
                if (accessor === "assigned_at") {
                  return formatDate(item[accessor]);
                }
                return item[accessor];
              }}
            />
          </Col>
        </Row>

        {/* Modal for delete confirmation */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to remove{" "}
            <strong>{selectedUser?.username}</strong> from this project?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleRemovePersonnel}>
              Remove
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </MainNav>
  );
};

export default AssignPersonnel;
