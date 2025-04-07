import axios from "axios";
import React, { useContext, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Image,
  Row,
  Toast,
} from "react-bootstrap";
import {
  FaCode,
  FaSignInAlt,
  FaUserCog,
  FaUserEdit,
  FaUserShield,
} from "react-icons/fa";
import { Route, Routes, useNavigate } from "react-router-dom";
import loginBackground from "../../assets/gears-background.svg"; // <-- UPDATE PATH
import TaskMasterIcon from "../../assets/taskmaster-logo.svg";
import { AuthContext } from "../../contexts/AuthProvider";
import "../../styles/login/LoginPage.scss";
import ForgotPassword from "./ForgotPassword";
import RegisterWithOrganization from "./RegisterWithOrganization";
import ResetPassword from "./ResetPassword";

// Custom hook for form handling
const useForm = <T extends Object>(initialState: T) => {
  const [formData, setFormData] = useState<T>(initialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return [formData, handleChange] as const;
};

// Define props for FormComponent
interface FormComponentProps {
  title: string;
  fields: Array<{
    label: string;
    type: string;
    placeholder: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
  }>;
  onSubmit: (e: React.FormEvent) => void;
  children?: React.ReactNode;
}

// General form component
const FormComponent: React.FC<FormComponentProps> = ({
  title,
  fields,
  onSubmit,
  children,
}) => {
  return (
    <Container className="login-page-container">
      <Row className="vh-100 d-flex justify-content-center align-items-center">
        <Col xs={12} md={8} lg={6} xl={5}>
          <div className="login-card">
            <Image
              src={TaskMasterIcon}
              alt="TaskMaster Logo"
              className="login-icon"
            />
            <h1 className="mb-4">{title}</h1>
            <Form onSubmit={onSubmit} className="w-100">
              <Row>
                <Col>
                  {fields.map((field) => (
                    <Form.Group
                      className="mb-3 text-start"
                      controlId={`formGroup${field.name}`}
                      key={field.name}
                    >
                      <Form.Label>{field.label}</Form.Label>
                      <Form.Control
                        type={field.type}
                        placeholder={field.placeholder}
                        name={field.name}
                        value={field.value}
                        onChange={field.onChange}
                        required={field.required}
                      />
                    </Form.Group>
                  ))}
                </Col>
              </Row>
              <div className="d-grid gap-2">{children}</div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

interface AuthContextType {
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
}

// Login component
const Login: React.FC = () => {
  const [formData, handleChange] = useForm({ username: "", password: "" });
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext) as AuthContextType;
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_URL}/auth/login`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setUser(response.data);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setShowToast(true);
    }
  };

  const fields = [
    {
      label: "Username",
      type: "text",
      placeholder: "Enter username",
      name: "username",
      value: formData.username,
      onChange: handleChange,
      required: true,
    },
    {
      label: "Password",
      type: "password",
      placeholder: "Password",
      name: "password",
      value: formData.password,
      onChange: handleChange,
      required: true,
    },
  ];

  return (
    <FormComponent title="Login" fields={fields} onSubmit={handleSubmit}>
      <Button className="mt-2" variant="primary" type="submit" size="lg">
        <FaSignInAlt className="me-2" /> Login
      </Button>
      <div className="form-links">
        <p>
          Forgot your{" "}
          <a href="#" onClick={() => navigate("/login/forgot-password")}>
            password?
          </a>
        </p>
        <p>
          New account?{" "}
          <a href="#" onClick={() => navigate("/login/register")}>
            Register here
          </a>
        </p>
        <p>
          Sign in as a{" "}
          <a href="#" onClick={() => navigate("/login/demo")}>
            demo user
          </a>
        </p>
      </div>
      {showToast && (
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
          bg="danger"
          className="position-fixed top-0 start-50 translate-middle-x mt-3"
        >
          <Toast.Header>
            <strong className="me-auto">Error</strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            Invalid username or password.
          </Toast.Body>
        </Toast>
      )}
    </FormComponent>
  );
};

// Register component
const Register: React.FC = () => {
  const [formData, handleChange] = useForm({
    username: "",
    password: "",
    email: "",
  });
  const navigate = useNavigate();
  const [showErrorToast, setShowErrorToast] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_URL}/auth/register`,
        { ...formData, role: "submitter" },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      setShowErrorToast(true);
    }
  };

  const fields = [
    {
      label: "Username",
      type: "text",
      placeholder: "Enter username",
      name: "username",
      value: formData.username,
      onChange: handleChange,
      required: true,
    },
    {
      label: "Password",
      type: "password",
      placeholder: "Password",
      name: "password",
      value: formData.password,
      onChange: handleChange,
      required: true,
    },
    {
      label: "Email",
      type: "email",
      placeholder: "Email",
      name: "email",
      value: formData.email,
      onChange: handleChange,
      required: true,
    },
  ];

  return (
    <FormComponent title="Register" fields={fields} onSubmit={handleSubmit}>
      <Button variant="secondary" onClick={() => navigate("/login")}>
        Back to login
      </Button>
      <Button variant="success" type="submit">
        Register
      </Button>
      {showErrorToast && (
        <Toast
          onClose={() => setShowErrorToast(false)}
          show={showErrorToast}
          delay={5000}
          autohide
          bg="danger"
          className="position-fixed top-0 start-50 translate-middle-x mt-3"
        >
          <Toast.Header>
            <strong className="me-auto">Error</strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            Registration failed. Please try again.
          </Toast.Body>
        </Toast>
      )}
    </FormComponent>
  );
};

// DemoUser component
const DemoUser: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext) as AuthContextType;
  const [showToast, setShowToast] = useState(false);

  const demoUsers = [
    {
      role: "Admin",
      username: "demo_admin",
      password: "demo123",
      icon: FaUserShield,
      variant: "danger",
    },
    {
      role: "Project Manager",
      username: "demo_pm",
      password: "demo123",
      icon: FaUserCog,
      variant: "warning",
    },
    {
      role: "Developer",
      username: "demo_dev",
      password: "demo123",
      icon: FaCode,
      variant: "info",
    },
    {
      role: "Submitter",
      username: "demo_sub",
      password: "demo123",
      icon: FaUserEdit,
      variant: "success",
    },
  ];

  const handleDemoLogin = async (user: {
    username: string;
    password: string;
  }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_URL}/auth/login`,
        { username: user.username, password: user.password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setUser(response.data);
      navigate("/dashboard");
    } catch (error) {
      console.error("Demo Login error:", error);
      setShowToast(true);
    }
  };

  return (
    <Container className="login-page-container">
      <Row className="vh-100 d-flex justify-content-center align-items-center">
        <Col xs={12} md={10} lg={8} xl={6}>
          <div className="demo-user-card">
            <Image
              src={TaskMasterIcon}
              alt="TaskMaster Logo"
              className="login-icon"
            />
            <h1 className="mb-4">Demo User Login</h1>
            <p className="text-muted mb-4">Select a role to log in as:</p>
            <Row className="g-3 demo-button-grid">
              {demoUsers.map((user) => (
                <Col xs={6} md={6} key={user.role}>
                  <Button
                    variant={`outline-${user.variant}`}
                    className="w-100 demo-button"
                    onClick={() => handleDemoLogin(user)}
                  >
                    <user.icon size={30} />
                    <span>{user.role}</span>
                  </Button>
                </Col>
              ))}
            </Row>
            <Button
              variant="secondary"
              onClick={() => navigate("/login")}
              className="back-button"
            >
              Back to Login
            </Button>
          </div>
          {showToast && (
            <Toast
              onClose={() => setShowToast(false)}
              show={showToast}
              delay={3000}
              autohide
              bg="danger"
              className="position-fixed top-0 start-50 translate-middle-x mt-3"
            >
              <Toast.Header>
                <strong className="me-auto">Error</strong>
              </Toast.Header>
              <Toast.Body className="text-white">
                Demo login failed. Ensure backend & DB are running and seeded.
              </Toast.Body>
            </Toast>
          )}
        </Col>
      </Row>
    </Container>
  );
};

// Main LoginPage component using React Router
const LoginPage: React.FC = () => {
  return (
    <div
      className="auth-background-wrapper"
      style={{ backgroundImage: `url(${loginBackground})` }}
    >
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<RegisterWithOrganization />} />
        <Route path="/demo" element={<DemoUser />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </div>
  );
};

export default LoginPage;
