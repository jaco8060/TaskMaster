import axios from "axios";
import { format } from "date-fns";
import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Modal,
  Row,
  Spinner,
  Toast,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext, AuthContextType } from "../../../contexts/AuthProvider";
import DataTable from "../../../hooks/DataTable";
import UserSelector from "../../../hooks/UserSelector";
import { MainNav } from "../NavBars";

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
  role: string;
  assigned_at: string;
}

interface User {
  id: string;
  username: string;
}

const AssignPersonnel: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the project ID from the URL
  const navigate = useNavigate();

  // Correctly use AuthContext with typing
  const { user, loading } = useContext(AuthContext) as AuthContextType;

  const [project, setProject] = useState<Project | null>(null);
  const [loadingProject, setLoadingProject] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<boolean>(false); // State to trigger DataTable refresh
  const [showModal, setShowModal] = useState<boolean>(false); // State to handle modal visibility
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // State to track the user being deleted
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

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
        setToastMessage("Failed to fetch project details.");
        setShowErrorToast(true);
      }
      setLoadingProject(false);
    };

    fetchProjectDetails();
  }, [id]);

  const handleAssignPersonnel = async (userIds: number[]) => {
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
      setToastMessage("Failed to assign personnel");
      setShowErrorToast(true);
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
      setToastMessage("Failed to remove personnel");
      setShowErrorToast(true);
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMMM d, yyyy h:mm a");
  };

  // Handle loading or redirect to login if user is not logged in
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

  if (!user) {
    // If no user is present, redirect to login or display a message
    navigate("/login");
    return null;
  }

  if (loadingProject) {
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
        onClose={() => setShowErrorToast(false)}
        show={showErrorToast}
        delay={3000}
        autohide
        bg="danger"
        className="position-fixed top-0 start-50 translate-middle-x mt-3"
      >
        <Toast.Header>
          <strong className="me-auto">Error</strong>
        </Toast.Header>
        <Toast.Body className="text-white">{toastMessage}</Toast.Body>
      </Toast>
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
              renderCell={(item: Personnel, accessor: string) => {
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
                  return formatDate(item["assigned_at"]);
                }

                // Cast the accessor to keyof Personnel where applicable
                return item[accessor as keyof Personnel];
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
