import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthProvider.jsx";
import UserSelector from "../../../hooks/UserSelector.jsx";
import { MainNav } from "../NavBars.jsx";

const AssignPersonnel = () => {
  const { id } = useParams(); // Get the project ID from the URL
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

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
    };

    fetchProjectDetails();
    setLoading(false);
  }, [id]);

  const handleAssignPersonnel = async (userIds, role) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_URL}/projects/${id}/personnel`,
        { userId: userIds[0], role }, // Assuming only one user can be assigned at a time
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      alert("Personnel assigned successfully.");
      navigate(`/project-details/${id}`);
    } catch (error) {
      console.error("Error assigning personnel:", error);
      alert("Failed to assign personnel.");
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

  return (
    <MainNav>
      <Container>
        <Row>
          <Col>
            <h1>Assign Personnel</h1>
            <p>
              <strong>Project Name:</strong> {project.name}
            </p>
            <p>
              <strong>Description:</strong> {project.description}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(project.created_at).toLocaleString()}
            </p>
            <p>
              <strong>Is Active:</strong> {project.is_active ? "Yes" : "No"}
            </p>
            <UserSelector
              endpoint={`${import.meta.env.VITE_URL}/users`}
              onAssign={handleAssignPersonnel}
            />
            <Button
              variant="secondary"
              className="mt-3"
              onClick={() => navigate(`/project-details/${id}`)}
            >
              Cancel
            </Button>
          </Col>
        </Row>
      </Container>
    </MainNav>
  );
};

export default AssignPersonnel;
