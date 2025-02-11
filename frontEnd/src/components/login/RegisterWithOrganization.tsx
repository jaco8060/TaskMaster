// frontEnd/src/components/login/RegisterWithOrganization.tsx

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
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "../../styles/login/RegisterWithOrganization.scss"; // Contains fade animations

const RegisterWithOrganization: React.FC = () => {
  const navigate = useNavigate();

  // Step state controls which “page” of questions is shown.
  const [step, setStep] = useState<number>(1);

  // Basic registration info state.
  const [basicInfo, setBasicInfo] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [basicInfoError, setBasicInfoError] = useState<string>("");

  // Organization-related states.
  const [orgChoice, setOrgChoice] = useState<"join" | "create" | null>(null);
  const [joinMethod, setJoinMethod] = useState<"code" | "search" | null>(null);
  const [orgJoinInfo, setOrgJoinInfo] = useState({
    organization_id: "",
    org_code: "",
  });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loadingSearch, setLoadingSearch] = useState<boolean>(false);
  const [selectedOrg, setSelectedOrg] = useState<any>(null);

  // Global message for final errors.
  const [message, setMessage] = useState<string>("");

  // --- Handlers for Basic Information Step ---
  const handleBasicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBasicInfo({ ...basicInfo, [e.target.name]: e.target.value });
  };

  const handleBasicInfoNext = () => {
    // Check for empty fields.
    if (
      !basicInfo.username ||
      !basicInfo.email ||
      !basicInfo.password ||
      !basicInfo.confirmPassword
    ) {
      setBasicInfoError("All fields are required.");
      return;
    }
    // Validate email format.
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(basicInfo.email)) {
      setBasicInfoError("Please enter a valid email address.");
      return;
    }
    // Check password match.
    if (basicInfo.password !== basicInfo.confirmPassword) {
      setBasicInfoError("Passwords do not match.");
      return;
    }
    // All validations passed.
    setBasicInfoError("");
    setStep(2);
  };

  // --- Handlers for Organization Joining/Creation ---
  const handleOrgJoinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrgJoinInfo({ ...orgJoinInfo, [e.target.name]: e.target.value });
  };

  const searchOrganizations = async () => {
    setLoadingSearch(true);
    try {
      // Call your backend API to search for organizations.
      const response = await fetch(
        `${
          import.meta.env.VITE_URL
        }/organizations/search?searchTerm=${encodeURIComponent(searchTerm)}`,
        { credentials: "include" }
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Error searching organizations", error);
    }
    setLoadingSearch(false);
  };

  // --- Final Submission Handler ---
  const handleSubmit = async () => {
    // Final check on password match.
    if (basicInfo.password !== basicInfo.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    // Build the registration data.
    const registrationData: any = {
      username: basicInfo.username,
      email: basicInfo.email,
      password: basicInfo.password,
      role: "user",
    };

    // If the user chose to join an organization using a code:
    if (orgChoice === "join" && joinMethod === "code") {
      registrationData.organization_id = orgJoinInfo.organization_id;
      registrationData.org_code = orgJoinInfo.org_code;
    }
    // (For the "search" branch or organization creation branch, you could add additional logic.)

    try {
      const response = await fetch(
        `${import.meta.env.VITE_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(registrationData),
        }
      );
      if (response.ok) {
        navigate("/login");
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || "Registration failed.");
      }
    } catch (error) {
      console.error("Registration error", error);
      setMessage("Registration failed.");
    }
  };

  // --- Render Step Content ---
  const getStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="step-content">
            <h3>Basic Information</h3>
            {basicInfoError && <Alert variant="danger">{basicInfoError}</Alert>}
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
            <div className="d-flex justify-content-between">
              <Button variant="secondary" onClick={() => navigate("/login")}>
                Cancel
              </Button>
              <Button onClick={handleBasicInfoNext}>Next</Button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="step-content">
            <h3>Organization Membership</h3>
            <p>Are you already a member of an organization?</p>
            <div className="d-flex flex-column gap-2">
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
            </div>
            <Button variant="link" onClick={() => setStep(1)}>
              Back
            </Button>
          </div>
        );
      case 3:
        if (orgChoice === "join") {
          return (
            <div className="step-content">
              <h3>Join Organization</h3>
              <p>How would you like to join?</p>
              <div className="d-flex flex-column gap-2">
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
              </div>
              <Button variant="link" onClick={() => setStep(2)}>
                Back
              </Button>
            </div>
          );
        } else if (orgChoice === "create") {
          return (
            <div className="step-content">
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
              {/* Additional organization creation fields could be added here */}
              <div className="d-flex justify-content-between">
                <Button variant="link" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button onClick={() => setStep(7)}>Next</Button>
              </div>
            </div>
          );
        }
        break;
      case 4:
        // Join with organization code
        return (
          <div className="step-content">
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
            <div className="d-flex justify-content-between">
              <Button variant="link" onClick={() => setStep(3)}>
                Back
              </Button>
              <Button onClick={() => setStep(7)}>Submit Registration</Button>
            </div>
          </div>
        );
      case 5:
        // Search and request to join
        return (
          <div className="step-content">
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
            {loadingSearch && <Spinner animation="border" className="mt-2" />}
            <div className="mt-3">
              {searchResults.map((org) => (
                <div
                  key={org.id}
                  className="org-result"
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
          </div>
        );
      case 6:
        // Confirm organization creation step
        return (
          <div className="step-content">
            <h3>Confirm Organization Creation</h3>
            <p>
              Your organization will be created and you will be registered as
              its admin.
            </p>
            <div className="d-flex justify-content-between">
              <Button variant="link" onClick={() => setStep(3)}>
                Back
              </Button>
              <Button onClick={() => setStep(7)}>Submit Registration</Button>
            </div>
          </div>
        );
      case 7:
        // Final submission step – call handleSubmit and show a spinner.
        // Note: handleSubmit is called immediately here.
        handleSubmit();
        return (
          <div className="step-content text-center">
            <h3>Submitting Registration...</h3>
            <Spinner animation="border" />
          </div>
        );
      case 8:
        // After a join request from the search flow.
        return (
          <div className="step-content">
            <h3>Request Submitted</h3>
            <p>
              Your request to join {selectedOrg?.name} has been submitted.
              Please await approval from the organization admin/PM.
            </p>
            <div className="d-flex justify-content-between">
              <Button onClick={() => navigate("/login")}>
                Return to Login
              </Button>
              <Button variant="link" onClick={() => setStep(5)}>
                Back
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Container className="mt-5">
      {message && <Alert variant="danger">{message}</Alert>}
      <TransitionGroup>
        <CSSTransition key={step} classNames="fade" timeout={500}>
          <div>{getStepContent()}</div>
        </CSSTransition>
      </TransitionGroup>
    </Container>
  );
};

export default RegisterWithOrganization;
