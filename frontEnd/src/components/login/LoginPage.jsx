import axios from "axios";
import { useContext, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthProvider";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";

// Enum for window states
export const WindowState = {
  LOGIN: "LOGIN",
  REGISTER: "REGISTER",
  DEMO: "DEMO",
  FORGOT_PASSWORD: "FORGOT_PASSWORD",
  RESET_PASSWORD: "RESET_PASSWORD",
};

const useForm = (initialState) => {
  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return [formData, handleChange];
};

const FormComponent = ({ title, fields, onSubmit, children }) => {
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

const Login = ({ setWindow }) => {
  const [formData, handleChange] = useForm({ username: "", password: "" });
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
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
    <FormComponent
      title="Bug Tracker Login"
      fields={fields}
      onSubmit={handleSubmit}
    >
      <div className="d-flex flex-column gap-4">
        <Button className="mt-2" variant="primary" type="submit">
          Login
        </Button>
        <div className="d-flex flex-column justify-content-center gap-1 align-items-center">
          <p className="my-0">
            Forgot your{" "}
            <span>
              <a
                href="#"
                onClick={() => setWindow(WindowState.FORGOT_PASSWORD)}
              >
                password
              </a>
            </span>
            ?
          </p>
          <p className="my-0">
            New account?{" "}
            <span>
              <a href="#" onClick={() => setWindow(WindowState.REGISTER)}>
                Register
              </a>
            </span>
          </p>
          <p className="my-0">
            Sign in as a{" "}
            <span>
              <a href="#" onClick={() => setWindow(WindowState.DEMO)}>
                demo user
              </a>
            </span>
          </p>
        </div>
      </div>
    </FormComponent>
  );
};

const Register = ({ setWindow }) => {
  const [formData, handleChange] = useForm({
    username: "",
    password: "",
    email: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_URL}/auth/register`,
        { ...formData, role: "user" },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setWindow(WindowState.LOGIN); // go back to login
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed");
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
      <Button variant="secondary" onClick={() => setWindow(WindowState.LOGIN)}>
        Back to login
      </Button>
      <Button variant="success" type="submit">
        Register
      </Button>
    </FormComponent>
  );
};

const DemoUser = ({ setWindow }) => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const demoUsers = [
    { role: "admin", username: "admin", password: "admin123" },
    { role: "project_manager", username: "project_manager", password: "pm123" },
    { role: "developer", username: "demo_dev", password: "demo123" },
    { role: "submitter", username: "demo_sub", password: "sub123" },
  ];

  const handleDemoLogin = async (user) => {
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
            <Button
              variant="secondary"
              onClick={() => setWindow(WindowState.LOGIN)}
            >
              Back to login
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

const LoginPage = () => {
  const [activeWindow, setWindow] = useState(WindowState.LOGIN);
  const [resetToken, setResetToken] = useState(null); // State to hold the reset token

  return (
    <>
      {activeWindow === WindowState.LOGIN && <Login setWindow={setWindow} />}
      {activeWindow === WindowState.REGISTER && (
        <Register setWindow={setWindow} />
      )}
      {activeWindow === WindowState.DEMO && <DemoUser setWindow={setWindow} />}
      {activeWindow === WindowState.FORGOT_PASSWORD && (
        <ForgotPassword setWindow={setWindow} />
      )}
      {activeWindow === WindowState.RESET_PASSWORD && (
        <ResetPassword setWindow={setWindow} resetToken={resetToken} />
      )}
    </>
  );
};

export default LoginPage;
