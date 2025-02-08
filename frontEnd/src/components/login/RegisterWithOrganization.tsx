import axios from "axios";
import React, { useState } from "react";
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const RegisterWithOrganization: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [basicInfo, setBasicInfo] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [orgChoice, setOrgChoice] = useState<"join" | "create" | null>(null);
  const [joinMethod, setJoinMethod] = useState<"code" | "search" | null>(null);
  const [orgJoinInfo, setOrgJoinInfo] = useState({
    organization_id: "",
    org_code: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<any>(null);
  const [message, setMessage] = useState("");

  // Handle changes for basic info and organization join info
  const handleBasicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBasicInfo({ ...basicInfo, [e.target.name]: e.target.value });
  };

  const handleOrgJoinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrgJoinInfo({ ...orgJoinInfo, [e.target.name]: e.target.value });
  };

  // Search organizations using backend API
  const searchOrganizations = async () => {
    setLoadingSearch(true);
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_URL
        }/organizations/search?searchTerm=${searchTerm}`,
        { withCredentials: true }
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error searching organizations", error);
    }
    setLoadingSearch(false);
  };

  // Final submission: build registration data and post to /auth/register
  const handleSubmit = async () => {
    if (basicInfo.password !== basicInfo.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    const registrationData: any = {
      ...basicInfo,
      role: "user",
    };
    if (orgChoice === "join" && joinMethod === "code") {
      registrationData.organization_id = orgJoinInfo.organization_id;
      registrationData.org_code = orgJoinInfo.org_code;
    }
    // For "create" branch, you might later call an organization creation endpoint
    try {
      await axios.post(
        `${import.meta.env.VITE_URL}/auth/register`,
        registrationData,
        { withCredentials: true }
      );
      navigate("/login");
    } catch (error) {
      console.error("Registration error", error);
      setMessage("Registration failed");
    }
  };

  // Render different steps
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h3>Basic Information</h3>
            <Form.Group controlId="username" className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={basicInfo.username}
                onChange={handleBasicChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="email" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={basicInfo.email}
                onChange={handleBasicChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="password" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={basicInfo.password}
                onChange={handleBasicChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="confirmPassword" className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={basicInfo.confirmPassword}
                onChange={handleBasicChange}
                required
              />
            </Form.Group>
            <Button onClick={() => setStep(2)}>Next</Button>
          </>
        );
      case 2:
        return (
          <>
            <h3>Organization Membership</h3>
            <p>Are you already a member of an organization?</p>
            <Button
              variant="primary"
              onClick={() => {
                setOrgChoice("join");
                setStep(3);
              }}
            >
              Yes, I want to join
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setOrgChoice("create");
                setStep(3);
              }}
            >
              No, I want to create one
            </Button>
            <Button variant="link" onClick={() => setStep(1)}>
              Back
            </Button>
          </>
        );
      case 3:
        if (orgChoice === "join") {
          return (
            <>
              <h3>Join Organization</h3>
              <p>How would you like to join?</p>
              <Button
                variant="primary"
                onClick={() => {
                  setJoinMethod("code");
                  setStep(4);
                }}
              >
                Join with Organization Code
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setJoinMethod("search");
                  setStep(5);
                }}
              >
                Search and Request to Join
              </Button>
              <Button variant="link" onClick={() => setStep(2)}>
                Back
              </Button>
            </>
          );
        } else if (orgChoice === "create") {
          return (
            <>
              <h3>Create Organization</h3>
              <Form.Group controlId="orgName" className="mb-3">
                <Form.Label>Organization Name</Form.Label>
                <Form.Control
                  type="text"
                  name="orgName"
                  placeholder="Enter organization name"
                  required
                />
              </Form.Group>
              {/* Additional organization creation fields can be added here */}
              <Button onClick={() => setStep(7)}>Next</Button>
              <Button variant="link" onClick={() => setStep(2)}>
                Back
              </Button>
            </>
          );
        }
        break;
      case 4:
        // Join with organization code
        return (
          <>
            <h3>Join with Organization Code</h3>
            <Form.Group controlId="organization_id" className="mb-3">
              <Form.Label>Organization ID</Form.Label>
              <Form.Control
                type="text"
                name="organization_id"
                value={orgJoinInfo.organization_id}
                onChange={handleOrgJoinChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="org_code" className="mb-3">
              <Form.Label>Organization Code</Form.Label>
              <Form.Control
                type="text"
                name="org_code"
                value={orgJoinInfo.org_code}
                onChange={handleOrgJoinChange}
                required
              />
            </Form.Group>
            <Button onClick={() => setStep(7)}>Submit Registration</Button>
            <Button variant="link" onClick={() => setStep(3)}>
              Back
            </Button>
          </>
        );
      case 5:
        // Search organizations and request join
        return (
          <>
            <h3>Search Organization</h3>
            <Form.Group controlId="searchTerm" className="mb-3">
              <Form.Label>Search Organization</Form.Label>
              <Form.Control
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Form.Group>
            <Button onClick={searchOrganizations}>Search</Button>
            {loadingSearch && <Spinner animation="border" />}
            <div>
              {searchResults.map((org) => (
                <div
                  key={org.id}
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    margin: "10px 0",
                  }}
                >
                  <p>
                    <strong>{org.name}</strong>
                  </p>
                  <Button
                    onClick={() => {
                      setSelectedOrg(org);
                      setStep(8);
                    }}
                  >
                    Request to Join
                  </Button>
                </div>
              ))}
            </div>
            <Button variant="link" onClick={() => setStep(3)}>
              Back
            </Button>
          </>
        );
      case 6:
        // For creating organization – you might want to call an endpoint to create organization first
        return (
          <>
            <h3>Confirm Organization Creation</h3>
            <p>
              Your organization will be created and you will be registered as
              its admin.
            </p>
            <Button onClick={() => setStep(7)}>Submit Registration</Button>
            <Button variant="link" onClick={() => setStep(3)}>
              Back
            </Button>
          </>
        );
      case 7:
        // Final submission step (for join with code or create organization)
        // We call handleSubmit and display a loading spinner
        handleSubmit();
        return (
          <div className="text-center">
            <h3>Submitting Registration...</h3>
            <Spinner animation="border" />
          </div>
        );
      case 8:
        // After requesting to join (search flow), show a waiting message
        return (
          <>
            <h3>Request Submitted</h3>
            <p>
              Your request to join {selectedOrg.name} has been submitted. Please
              await approval from the organization admin/PM.
            </p>
            <Button onClick={() => navigate("/login")}>Return to Login</Button>
            <Button variant="link" onClick={() => setStep(5)}>
              Back
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Container className="mt-5">
      {message && <Alert variant="danger">{message}</Alert>}
      <Row className="justify-content-center">
        <Col xs={12} md={8}>
          {renderStep()}
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterWithOrganization;
