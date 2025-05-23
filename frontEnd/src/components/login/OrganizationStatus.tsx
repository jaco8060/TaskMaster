import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Card, Container, Spinner, Toast } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import TaskmasterLogo from "../../assets/taskmaster-logo-animation.svg";
import "../../styles/dashboard/OrganizationStatus.scss";
import OrganizationSearch from "./OrganizationSearch.tsx";
interface OrganizationStatusProps {
  userId: number;
}

const OrganizationStatus: React.FC<OrganizationStatusProps> = ({ userId }) => {
  const [status, setStatus] = useState<
    "approved" | "pending" | "rejected" | "none"
  >("none");
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_URL}/organizations/status`,
          { withCredentials: true }
        );
        setStatus(response.data.status);
      } catch (error) {
        console.error("Error checking organization status:", error);
      } finally {
        setLoading(false);
      }
    };

    // Check status whenever userId changes or component mounts
    checkStatus();
  }, [userId]); // Add userId to dependency array

  const handleCancelRequest = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_URL}/organizations/cancel-request`,
        {
          withCredentials: true,
        }
      );
      setStatus("none");
      setShowToast(true);
    } catch (error) {
      console.error("Error canceling request:", error);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (status === "pending") {
    return (
      <Container className="d-flex flex-column justify-content-center align-items-center vh-100">
        <div className="loading-animation">
          <div className="spinner">
            <img src={TaskmasterLogo} alt="Loading animation" />
          </div>
        </div>
        <h3 className="mt-4">Waiting for Organization Approval</h3>
        <p className="text-muted">
          Your request is pending review by the organization admin
        </p>
        <Button
          variant="outline-danger"
          onClick={handleCancelRequest}
          className="mt-3"
        >
          Cancel Request
        </Button>

        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
        >
          <Toast.Body>Request canceled successfully</Toast.Body>
        </Toast>
      </Container>
    );
  }

  if (status === "rejected" || status === "none") {
    return <OrganizationSearch onJoinSuccess={() => navigate("/dashboard")} />;
  }

  return null;
};

export default OrganizationStatus;
