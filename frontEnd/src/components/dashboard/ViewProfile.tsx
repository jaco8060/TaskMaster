import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Col,
  Container,
  Image,
  Row,
  Spinner,
  Toast,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { MainNav } from "./NavBars";

interface UserProfile {
  id: number;
  username: string;
  email: string;
  role: string;
  first_name?: string;
  last_name?: string;
  organization_id?: number;
  profile_picture?: string;
  bio?: string;
}

const ViewProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  const roleDescriptions = {
    admin: "Administrator - Manages the organization and users.",
    pm: "Project Manager - Oversees projects and assigns tasks.",
    developer: "Developer - Works on tickets and project development.",
    submitter: "Submitter - Reports issues and submits tickets.",
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_URL}/users/${id}`,
          {
            withCredentials: true,
          }
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
        setMessage("Failed to load user profile");
        setShowToast(true);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <MainNav>
        <Container
          className="d-flex justify-content-center align-items-center"
          style={{ height: "100vh" }}
        >
          <Spinner animation="border" variant="primary" />
        </Container>
      </MainNav>
    );
  }

  if (!user) {
    return (
      <MainNav>
        <Container className="section-container">
          <h2>User Profile</h2>
          <Alert variant="danger">User not found</Alert>
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Back
          </Button>
        </Container>
      </MainNav>
    );
  }

  return (
    <MainNav>
      <Container className="section-container">
        <h2>User Profile</h2>
        {message && (
          <Toast
            onClose={() => setShowToast(false)}
            show={showToast}
            delay={3000}
            autohide
            bg="danger"
            className="position-fixed start-50 translate-middle-x"
            style={{ top: "70px" }}
          >
            <Toast.Header>
              <strong className="me-auto">Error</strong>
            </Toast.Header>
            <Toast.Body className="text-white">{message}</Toast.Body>
          </Toast>
        )}
        <div className="profile-details">
          <Row>
            <Col md={4} className="text-center">
              <Image
                src={
                  user.profile_picture
                    ? `${import.meta.env.VITE_URL}/uploads/profile_pictures/${
                        user.profile_picture
                      }`
                    : `${
                        import.meta.env.VITE_URL
                      }/uploads/profile_pictures/default_profile.svg`
                }
                roundedCircle
                width={200}
                height={200}
                className="mb-3"
              />
            </Col>
            <Col md={8}>
              <p>
                <strong>Username:</strong> {user.username}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>First Name:</strong> {user.first_name || "Not set"}
              </p>
              <p>
                <strong>Last Name:</strong> {user.last_name || "Not set"}
              </p>
              <p>
                <strong>Bio:</strong> {user.bio || "Not set"}
              </p>
              <p>
                <strong>Role:</strong> {user.role} -{" "}
                {roleDescriptions[user.role as keyof typeof roleDescriptions] ||
                  "No description"}
              </p>
            </Col>
          </Row>
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>
      </Container>
    </MainNav>
  );
};

export default ViewProfile;
