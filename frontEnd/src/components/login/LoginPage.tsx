import axios from "axios";
import React, { useContext, useState } from "react";
import { Button, Col, Container, Form, Row, Toast } from "react-bootstrap";
import { Route, Routes, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthProvider";
import ForgotPassword from "./ForgotPassword";
import RegisterWithOrganization from "./RegisterWithOrganization";
import ResetPassword from "./ResetPassword.tsx";


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
    <Container>
      <Row className="vh-100 d-flex justify-content-center align-items-center">
        <Col xs={12} md={8} lg={6}>
          <div className="d-flex flex-column p-4 justify-content-center align-items-center border rounded shadow-sm border-primary-subtle bg-light">
            <h1 className="mb-4">{title}</h1>
            <Form onSubmit={onSubmit} className="w-75">
              <Row>
                <Col>
                  {fields.map((field) => (
                    <Form.Group
                      className="mb-3"
                      controlId={`formGroup${field.name}`}
                      key={field.name}
                    >
                      <Form.Label>{field.label}*</Form.Label>
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
              <div className="d-flex justify-content-center gap-3">
                {children}
              </div>
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_URL}/auth/login`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setUser(response.data);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed");
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
      <div className="d-flex flex-column gap-4">
        <Button className="mt-2" variant="primary" type="submit">
          Login
        </Button>
        <div className="d-flex flex-column justify-content-center gap-1 align-items-center">
          <p className="my-0">
            Forgot your{" "}
            <span>
              <a href="#" onClick={() => navigate("/login/forgot-password")}>
                password
              </a>
            </span>
            ?
          </p>
          <p className="my-0">
            New account?{" "}
            <span>
              <a href="#" onClick={() => navigate("/login/register")}>
                Register
              </a>
            </span>
          </p>
          <p className="my-0">
            Sign in as a{" "}
            <span>
              <a href="#" onClick={() => navigate("/login/demo")}>
                demo user
              </a>
            </span>
          </p>
        </div>
      </div>
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

  const demoUsers = [
    { role: "admin", username: "demo_admin", password: "demo123" },
    {
      role: "pm",
      username: "demo_pm",
      password: "demo123",
    },
    { role: "developer", username: "demo_dev", password: "demo123" },
    { role: "submitter", username: "demo_sub", password: "demo123" },
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
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setUser(response.data);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      alert("Demo login failed");
    }
  };

  return (
    <Container>
      <Row className="vh-100 d-flex justify-content-center align-items-center">
        <Col xs={12} md={8} lg={6}>
          <div className="d-flex flex-column p-4 justify-content-center align-items-center border rounded shadow-sm">
            <h1 className="mb-4">Demo User Login</h1>
            {demoUsers.map((user) => (
              <Button
                key={user.role}
                variant="primary"
                className="mb-2"
                onClick={() => handleDemoLogin(user)}
              >
                Login as {user.role.replace("_", " ")}
              </Button>
            ))}
            <Button variant="secondary" onClick={() => navigate("/login")}>
              Back to login
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

// Main LoginPage component using React Router
const LoginPage: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<RegisterWithOrganization />} />
      <Route path="/demo" element={<DemoUser />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
    </Routes>
  );
};

export default LoginPage;
