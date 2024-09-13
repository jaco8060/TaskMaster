import axios from "axios";
import React, { FormEvent, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // Use navigation instead of setWindow

const ForgotPassword: React.FC = () => {
  const [username, setUsername] = useState<string>(""); // State for username
  const [message, setMessage] = useState<string>(""); // State for feedback message
  const navigate = useNavigate(); // Use useNavigate for navigation

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_URL}/auth/forgot-password`,
        { username },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setMessage(response.data.message);
    } catch (error) {
      console.error("Forgot password error:", error);
      setMessage("Failed to send reset email.");
    }
  };

  return (
    <Container>
      <Row className="vh-100 d-flex justify-content-center align-items-center">
        <Col xs={12} md={8} lg={6}>
          <div className="d-flex flex-column p-4 justify-content-center align-items-center border rounded shadow-sm">
            <h1 className="mb-4">Forgot Password</h1>
            <Form onSubmit={handleSubmit} className="w-75">
              <Form.Group className="mb-3" controlId="formUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Form.Group>
              <div className="d-flex justify-content-center">
                <Button variant="primary" type="submit">
                  Send Reset Email
                </Button>
              </div>
            </Form>
            {message && <p className="mt-3">{message}</p>}
            <Button
              variant="secondary"
              className="mt-3"
              onClick={() => navigate("/login")} // Navigate back to login
            >
              Back to Login
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPassword;
