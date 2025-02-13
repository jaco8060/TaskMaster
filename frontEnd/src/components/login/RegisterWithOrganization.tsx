// frontEnd/src/components/login/RegisterWithOrganization.tsx
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  Row,
  Spinner,
  Toast,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "../../styles/login/RegisterWithOrganization.scss"; // Contains fade animations

interface BasicInfo {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterWithOrganization: React.FC = () => {
  const navigate = useNavigate();

  // Step state controls which "page" of questions is shown.
  const [step, setStep] = useState<number>(1);

  // Basic registration info state.
  const [basicInfo, setBasicInfo] = useState<BasicInfo>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [basicInfoError, setBasicInfoError] = useState<string>("");

  // State: to track username availability.
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null
  );

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

  // State to capture the organization name when creating one.
  const [organizationName, setOrganizationName] = useState<string>("");

  // Global message for final errors.
  const [message, setMessage] = useState<{ type: string, content: string } | null>(null);

  // State for error toast
  const [showErrorToast, setShowErrorToast] = useState(false);

  // Function to check username availability using Axios
  const checkUsernameAvailability = async (
    username: string
  ): Promise<boolean> => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_URL
        }/auth/check-username?username=${encodeURIComponent(username)}`,
        { withCredentials: true }
      );
      // Assume response.data.exists is true if the username exists.
      return !response.data.exists;
    } catch (error) {
      console.error("Error checking username:", error);
      // In case of error, assume username is unavailable.
      return false;
    }
  };

  // Debounce the username availability check when the username changes.
  useEffect(() => {
    if (basicInfo.username.trim() !== "") {
      const timer = setTimeout(() => {
        checkUsernameAvailability(basicInfo.username).then((available) => {
          setUsernameAvailable(available);
        });
      }, 500); // 500ms debounce delay
      return () => clearTimeout(timer);
    } else {
      setUsernameAvailable(null);
    }
  }, [basicInfo.username]);

  // --- Handlers for Basic Information Step ---
  const handleBasicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBasicInfo({ ...basicInfo, [e.target.name]: e.target.value });
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const isStep1Valid =
    basicInfo.username.trim() !== "" &&
    basicInfo.email.trim() !== "" &&
    basicInfo.password.trim() !== "" &&
    basicInfo.confirmPassword.trim() !== "" &&
    emailRegex.test(basicInfo.email) &&
    basicInfo.password === basicInfo.confirmPassword &&
    usernameAvailable === true;

  const handleBasicInfoNext = () => {
    if (
      !basicInfo.username ||
      !basicInfo.email ||
      !basicInfo.password ||
      !basicInfo.confirmPassword
    ) {
      setBasicInfoError("All fields are required.");
      return;
    }
    if (!emailRegex.test(basicInfo.email)) {
      setBasicInfoError("Please enter a valid email address.");
      return;
    }
    if (basicInfo.password !== basicInfo.confirmPassword) {
      setBasicInfoError("Passwords do not match.");
      return;
    }
    if (usernameAvailable === false) {
      setBasicInfoError("Username is already taken.");
      return;
    }
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
      const response = await axios.get(
        `${
          import.meta.env.VITE_URL
        }/organizations/search?searchTerm=${encodeURIComponent(searchTerm)}`,
        { withCredentials: true }
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error searching organizations", error);
    }
    setLoadingSearch(false);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim() !== "") {
        searchOrganizations();
      } else {
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // --- Final Submission Handler using Axios ---
  const handleSubmit = async () => {
    if (basicInfo.password !== basicInfo.confirmPassword) {
      setMessage({ type: 'error', content: "Passwords do not match." });
      setShowErrorToast(true);
      return;
    }
    const registrationData: any = {
      username: basicInfo.username,
      email: basicInfo.email,
      password: basicInfo.password,
      role: "submitter",
    };

    // If joining with code...
    if (orgChoice === "join" && joinMethod === "code") {
      registrationData.org_code = orgJoinInfo.org_code;
    }
    // If creating an organization, include the organization name.
    else if (orgChoice === "create") {
      registrationData.organization_name = organizationName;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_URL}/auth/register`,
        registrationData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      // Registration successful, navigate to login.
      navigate("/login");
    } catch (error) {
      console.error("Registration error", error);
      if (axios.isAxiosError(error) && error.response) {
        setMessage({ type: 'error', content: error.response.data.error || "Registration failed." });
      } else {
        setMessage({ type: 'error', content: "Registration failed." });
      }
      setShowErrorToast(true);
    }
  };

  // useEffect to call handleSubmit only once when step === 7
  useEffect(() => {
    if (step === 7) {
      handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

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
              {basicInfo.username.trim() !== "" &&
                usernameAvailable === false && (
                  <Form.Text className="text-danger">
                    Username is already taken.
                  </Form.Text>
                )}
              {basicInfo.username.trim() !== "" &&
                usernameAvailable === true && (
                  <Form.Text className="text-success">
                    Username is available.
                  </Form.Text>
                )}
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
              <Button onClick={handleBasicInfoNext} disabled={!isStep1Valid}>
                Next
              </Button>
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
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  required
                />
              </Form.Group>
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
        // Search and request to join with dynamic search.
        return (
          <div className="step-content">
            <h3>Search Organization</h3>
            <Form.Group controlId="searchTerm" className="mb-3">
              <Form.Label>Search Organization</Form.Label>
              <Form.Control
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Type to search..."
              />
            </Form.Group>
            {loadingSearch && <Spinner animation="border" className="mt-2" />}
            <div className="mt-3">
              {searchResults.length > 0 ? (
                searchResults.map((org) => (
                  <div
                    key={org.id}
                    className="org-result"
                    style={{
                      border: "1px solid #ccc",
                      padding: "10px",
                      margin: "10px 0",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setSelectedOrg(org);
                      setStep(8);
                    }}
                  >
                    <p>
                      <strong>{org.name}</strong>
                    </p>
                    <p>Organization ID: {org.id}</p>
                  </div>
                ))
              ) : (
                <p>No organizations found.</p>
              )}
            </div>
            <Button variant="link" onClick={() => setStep(3)}>
              Back
            </Button>
          </div>
        );
      case 6:
        // Confirm organization creation step.
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
        // Final submission step – now we simply show a spinner.
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
      {message && (
        <Toast 
          onClose={() => setMessage(null)} 
          show={!!message} 
          delay={5000} 
          autohide
          bg={message.type === 'error' ? 'danger' : 'success'}
          className="position-fixed top-0 start-50 translate-middle-x mt-3"
        >
          <Toast.Header>
            <strong className="me-auto">{message.type === 'error' ? 'Error' : 'Success'}</strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            {message.content}
          </Toast.Body>
        </Toast>
      )}
      <TransitionGroup>
        <CSSTransition key={step} classNames="fade" timeout={500}>
          <div>{getStepContent()}</div>
        </CSSTransition>
      </TransitionGroup>
    </Container>
  );
};

export default RegisterWithOrganization;
