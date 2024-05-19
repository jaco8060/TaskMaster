import axios from "axios";
import { useContext, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthProvider";

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
          <div className="d-flex flex-column p-4 justify-content-center align-items-center border rounded shadow-sm">
            <h1>{title}</h1>
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
    <FormComponent title="Login" fields={fields} onSubmit={handleSubmit}>
      <Button variant="primary" type="submit">
        Login
      </Button>
      <Button variant="secondary" onClick={setWindow}>
        Register
      </Button>
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
      setWindow(); // go back to login
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
    },
  ];

  return (
    <FormComponent title="Register" fields={fields} onSubmit={handleSubmit}>
      <Button variant="secondary" onClick={setWindow}>
        Back to login
      </Button>
      <Button variant="success" type="submit">
        Register
      </Button>
    </FormComponent>
  );
};

const LoginPage = () => {
  const [activeWindow, setWindow] = useState("login");

  return (
    <>
      {activeWindow === "login" ? (
        <Login setWindow={() => setWindow("register")} />
      ) : (
        <Register setWindow={() => setWindow("login")} />
      )}
    </>
  );
};

export default LoginPage;
