import axios from "axios";
import React, { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>(); // Get token from URL parameters
  const navigate = useNavigate(); // Use useNavigate for navigation
  const [password, setPassword] = useState<string>(""); // State for new password
  const [confirmPassword, setConfirmPassword] = useState<string>(""); // State for confirm password
  const [message, setMessage] = useState<string>(""); // State for feedback message

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_URL}/auth/reset-password`,
        { token, password }, // Use token from URL
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setMessage(response.data.message);
      setTimeout(() => {
        navigate("/login"); // Redirect to login after 3 seconds
      }, 3000);
    } catch (error) {
      console.error("Reset password error:", error);
      setMessage("Failed to reset password.");
    }
  };

  return (
    <Container>
      <Row className="vh-100 d-flex justify-content-center align-items-center">
        <Col xs={12} md={8} lg={6}>
          <div className="d-flex flex-column p-4 justify-content-center align-items-center border rounded shadow-sm">
            <h1 className="mb-4">Reset Password</h1>
            <Form onSubmit={handleSubmit} className="w-75">
              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formConfirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Reset Password
              </Button>
            </Form>
            {message && <p className="mt-3">{message}</p>}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ResetPassword;
