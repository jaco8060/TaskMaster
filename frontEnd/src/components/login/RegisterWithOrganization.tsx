// RegisterWithOrganization.tsx

// frontEnd/src/components/login/RegisterWithOrganization.tsx
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Col,
  Container,
  Form,
  Image,
  Row,
  Spinner,
  Toast,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import TaskMasterIcon from "../../assets/taskmaster-logo.svg"; // Import icon
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

  // Add new state for email availability
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);

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
  const [message, setMessage] = useState<{
    type: string;
    content: string;
  } | null>(null);

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

  // Add email check function similar to username check
  const checkEmailAvailability = async (email: string): Promise<boolean> => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_URL
        }/auth/check-email?email=${encodeURIComponent(email)}`,
        { withCredentials: true }
      );
      return !response.data.exists;
    } catch (error) {
      console.error("Error checking email:", error);
      return false;
    }
  };

  // Add useEffect for email availability debounce
  useEffect(() => {
    if (basicInfo.email.trim() !== "" && emailRegex.test(basicInfo.email)) {
      const timer = setTimeout(() => {
        checkEmailAvailability(basicInfo.email).then((available) => {
          setEmailAvailable(available);
        });
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setEmailAvailable(null);
    }
  }, [basicInfo.email]);

  // --- Handlers for Basic Information Step ---
  const handleBasicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBasicInfo({ ...basicInfo, [e.target.name]: e.target.value });
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Update isStep1Valid check
  const isStep1Valid =
    basicInfo.username.trim() !== "" &&
    basicInfo.email.trim() !== "" &&
    emailRegex.test(basicInfo.email) &&
    basicInfo.password.trim() !== "" &&
    basicInfo.password === basicInfo.confirmPassword &&
    usernameAvailable === true &&
    emailAvailable === true;

  // Update handleBasicInfoNext validation
  const handleBasicInfoNext = () => {
    // Reset error
    setBasicInfoError("");
    let errors = [];
    if (!basicInfo.username) errors.push("Username is required.");
    if (!basicInfo.email) errors.push("Email is required.");
    else if (!emailRegex.test(basicInfo.email))
      errors.push("Please enter a valid email address.");
    if (!basicInfo.password) errors.push("Password is required.");
    if (!basicInfo.confirmPassword)
      errors.push("Confirm Password is required.");
    else if (basicInfo.password !== basicInfo.confirmPassword)
      errors.push("Passwords do not match.");

    // Check availability status only if other fields are valid
    if (errors.length === 0) {
      if (usernameAvailable === false) errors.push("Username is already taken.");
      if (emailAvailable === false) errors.push("Email is already registered.");
      if (usernameAvailable === null || emailAvailable === null)
        errors.push(
          "Please wait for username and email availability check."
        );
    }

    if (errors.length > 0) {
      setBasicInfoError(errors.join(" "));
      return;
    }

    // If all checks pass
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

  // Update search results handling
  const handleOrgSelection = (org: any) => {
    setSelectedOrg(org);
  };

  // --- Final Submission Handler using Axios ---
  const handleSubmit = async () => {
    setMessage(null); // Clear previous messages before submitting
    try {
      const registrationData: any = {
        username: basicInfo.username,
        email: basicInfo.email,
        password: basicInfo.password,
        role: "submitter",
      };

      // Add organization name when creating new org
      if (orgChoice === "create") {
        registrationData.organization_name = organizationName;
      }

      // Set organization parameters based on join method
      if (joinMethod === "code") {
        registrationData.org_code = orgJoinInfo.org_code;
      } else if (joinMethod === "search" && selectedOrg) {
        registrationData.organization_id = selectedOrg.id;
        registrationData.requestJoin = true;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_URL}/auth/register`,
        registrationData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      // Handle different success cases
      if (response.data.message?.includes("Awaiting approval")) {
        setMessage({ type: "success", content: response.data.message });
        setStep(8);
      } else {
        // On successful registration without needing approval, redirect to login
        // Optionally: pass a success message via navigate state
        navigate("/login", { state: { message: "Registration successful! Please log in." } });
      }
    } catch (error) {
      // Handle error display
      let errorMessage = "Registration failed. Please try again.";
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.error || errorMessage;
      }
      setMessage({
        type: "error",
        content: errorMessage,
      });
      // Instead of setting showErrorToast, the message state handles the toast display
      setStep(2); // Return to organization selection or an appropriate step
    }
  };

  // useEffect to call handleSubmit only once when step === 7
  useEffect(() => {
    if (step === 7) {
      handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const validateOrgCode = async (code: string): Promise<boolean> => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_URL}/organizations/validate-code/${code}`,
        { withCredentials: true }
      );
      return response.data.valid;
    } catch (error) {
      console.error("Error validating organization code:", error);
      setMessage({
          type: "error",
          content: "Failed to validate organization code. Please try again."
      });
      return false;
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
            <Form.Group controlId="username" className="mb-2">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={basicInfo.username}
                onChange={handleBasicChange}
                required
                isInvalid={usernameAvailable === false}
                isValid={usernameAvailable === true}
              />
              <Form.Control.Feedback type="invalid">
                 Username is already taken.
              </Form.Control.Feedback>
              <Form.Control.Feedback type="valid">
                 Username is available.
              </Form.Control.Feedback>
              {usernameAvailable === null && basicInfo.username.trim() !== '' && <Form.Text>Checking...</Form.Text>}
              {usernameAvailable === null && basicInfo.username.trim() === '' && <Form.Text>&nbsp;</Form.Text>}
            </Form.Group>
            <Form.Group controlId="email" className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={basicInfo.email}
                onChange={handleBasicChange}
                required
                isInvalid={emailAvailable === false || (basicInfo.email.trim() !== '' && !emailRegex.test(basicInfo.email))}
                isValid={emailAvailable === true && emailRegex.test(basicInfo.email)}
              />
              <Form.Control.Feedback type="invalid">
                {emailAvailable === false ? "Email is already registered." : "Please enter a valid email address."}
              </Form.Control.Feedback>
              <Form.Control.Feedback type="valid">
                 Email is available.
              </Form.Control.Feedback>
              {emailAvailable === null && basicInfo.email.trim() !== '' && emailRegex.test(basicInfo.email) && <Form.Text>Checking...</Form.Text>}
              {emailAvailable === null && (basicInfo.email.trim() === '' || !emailRegex.test(basicInfo.email)) && <Form.Text>&nbsp;</Form.Text>}
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
                isInvalid={basicInfo.password !== basicInfo.confirmPassword && basicInfo.confirmPassword !== ''}
              />
               <Form.Control.Feedback type="invalid">
                 Passwords do not match.
               </Form.Control.Feedback>
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
            <p>Do you want to join an existing organization or create a new one?</p>
            <div className="d-flex flex-column gap-2">
              <Button
                variant="primary"
                onClick={() => {
                  setOrgChoice("join");
                  setStep(3);
                }}
              >
                Join Organization
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setOrgChoice("create");
                  setStep(3);
                }}
              >
                Create New Organization
              </Button>
            </div>
            <Button variant="link" onClick={() => setStep(1)} className="mt-3">
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
              <Button variant="link" onClick={() => setStep(2)} className="mt-3">
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
                {!organizationName && <Form.Text className="text-muted">Organization name is required.</Form.Text>}
              </Form.Group>
              <div className="d-flex justify-content-between">
                <Button variant="link" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button onClick={() => setStep(7)} disabled={!organizationName.trim()}>
                   Create & Register
                </Button>
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
                placeholder="Enter the code provided by your organization"
                required
              />
              {message?.type === "error" && message.content.includes("Invalid organization code") && (
                 <Form.Text className="text-danger">{message.content}</Form.Text>
              )}
            </Form.Group>
            <div className="d-flex justify-content-between">
              <Button variant="link" onClick={() => setStep(3)}>
                Back
              </Button>
              <Button
                onClick={async () => {
                  setMessage(null);
                  const isValid = await validateOrgCode(orgJoinInfo.org_code);
                  if (isValid) {
                    setStep(7);
                  } else if (!message) {
                    setMessage({
                      type: "error",
                      content: "Invalid organization code. Please check and try again.",
                    });
                  }
                }}
                disabled={!orgJoinInfo.org_code.trim()}
              >
                Join & Register
              </Button>
            </div>
          </div>
        );
      case 5:
        // Search and request to join with dynamic search.
        return (
          <div className="step-content">
            <h3>Search Organizations</h3>
            <Form.Group controlId="searchOrganizations" className="mb-3">
              <Form.Label>Search by Organization Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Start typing to search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Form.Group>

            {loadingSearch && <div className="text-center"><Spinner animation="border" size="sm"/></div>}

            {!loadingSearch && searchTerm.trim() !== "" && searchResults.length === 0 && (
              <Alert variant="info" className="mt-3">No organizations found matching "{searchTerm}".</Alert>
            )}

            {searchResults.length > 0 && (
              <div className="organization-list mt-3">
                {searchResults.map((org) => (
                  <div
                    key={org.id}
                    className={`organization-card p-2 mb-2 d-flex justify-content-between align-items-center ${
                      selectedOrg?.id === org.id ? "selected" : ""
                    }`}
                    onClick={() => handleOrgSelection(org)}
                  >
                    <div>
                      <h5 className="mb-1">{org.name}</h5>
                      <small className="text-muted">
                        Members: {org.member_count}
                      </small>
                    </div>
                    {selectedOrg?.id === org.id && (
                      <Badge pill bg="success">Selected</Badge>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="d-flex justify-content-between mt-4">
              <Button variant="secondary" onClick={() => setStep(3)}>
                Back
              </Button>
              <Button
                variant="primary"
                onClick={() => { if (selectedOrg) setStep(7); }}
                disabled={!selectedOrg}
              >
                Request to Join Selected
              </Button>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="step-content">
            <h3>Confirm Organization Creation</h3>
            <p>
              You are about to create the organization "{organizationName}" and register as its first member.
            </p>
            <div className="d-flex justify-content-between">
              <Button variant="link" onClick={() => setStep(3)}>
                Back
              </Button>
              <Button onClick={() => setStep(7)}>Confirm & Register</Button>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="step-content text-center">
            <h3>Submitting Registration...</h3>
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        );
      case 8:
        return (
          <div className="step-content">
            <h3>Request Submitted</h3>
            <Alert variant="success">
              {message?.content ||
               `Your request to join ${selectedOrg?.name || 'the organization'} has been submitted. Please await approval from an administrator.`
              }
            </Alert>
            <p>You will be notified once your request is reviewed.</p>
            <div className="d-flex justify-content-center mt-4">
              <Button onClick={() => navigate("/login")}>
                Return to Login
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Container fluid className="p-0 register-page-background">
      <Row className="vh-100 d-flex justify-content-center align-items-center m-0">
         <Col xs={11} sm={10} md={8} lg={6} xl={5}>
            <div className="login-card p-4 p-md-5">

              <div className="text-center mb-4">
                 <Image src={TaskMasterIcon} alt="TaskMaster Logo" className="login-icon mb-3" style={{ height: '60px' }} />
                 <h1>Register Account</h1>
              </div>

              {message && (
                <Toast
                  onClose={() => setMessage(null)}
                  show={!!message}
                  delay={6000}
                  autohide
                  bg={message.type === "error" ? "danger" : "success"}
                  className="position-fixed top-0 start-50 translate-middle-x mt-3"
                  style={{ zIndex: 1056 }}
                >
                  <Toast.Header closeButton={true}>
                    <strong className="me-auto">
                      {message.type === "error" ? "Error" : "Success"}
                    </strong>
                  </Toast.Header>
                  <Toast.Body className={message.type === 'error' ? 'text-white' : 'text-dark'}>
                    {message.content}
                  </Toast.Body>
                </Toast>
              )}

              <TransitionGroup component={null}>
                <CSSTransition
                  key={step}
                  timeout={300}
                  classNames="fade"
                  unmountOnExit
                >
                   <div>
                      {getStepContent()}
                   </div>
                </CSSTransition>
              </TransitionGroup>

            </div>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterWithOrganization;
