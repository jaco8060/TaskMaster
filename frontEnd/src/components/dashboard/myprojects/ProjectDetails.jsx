import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { MainNav } from "../NavBars.jsx";

const ProjectDetails = () => {
  const { id } = useParams(); // Get the project ID from the URL
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_URL}/projects/${id}`,
          { withCredentials: true }
        );
        setProject(response.data);
      } catch (error) {
        console.error("Error fetching project details:", error);
        alert("Failed to fetch project details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id]);

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
            <h1>Project Details</h1>
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
            <Button variant="primary" onClick={() => navigate(-1)}>
              Go Back
            </Button>
          </Col>
        </Row>
      </Container>
    </MainNav>
  );
};

export default ProjectDetails;
