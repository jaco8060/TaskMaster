// frontEnd/src/components/dashboard/UserProfile.tsx
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  Image,
  Row,
} from "react-bootstrap";
import { AuthContext, AuthContextType } from "../../contexts/AuthProvider";
import { MainNav } from "./NavBars";

const UserProfile: React.FC = () => {
  // Assumes your User type now includes profile_picture?: string
  const { user, setUser } = useContext(AuthContext) as AuthContextType;
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [message, setMessage] = useState("");
  const [roleRequestMessage, setRoleRequestMessage] = useState("");

  // Generate a preview of the selected profile picture file
  useEffect(() => {
    if (profilePicture) {
      const objectUrl = URL.createObjectURL(profilePicture);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview("");
    }
  }, [profilePicture]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    if (password) {
      formData.append("password", password);
      formData.append("confirmPassword", confirmPassword);
    }
    if (profilePicture) {
      formData.append("profile_picture", profilePicture);
    }
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_URL}/users/profile`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUser(response.data);
      setMessage("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile", error);
      setMessage("Failed to update profile");
    }
  };

  const handleRoleRequest = async () => {
    if (!roleRequestMessage) {
      setMessage("Please enter a message for role change request");
      return;
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_URL}/users/request-role-change`,
        { message: roleRequestMessage },
        { withCredentials: true }
      );
      setMessage(response.data.message);
      setRoleRequestMessage("");
    } catch (error) {
      console.error("Error requesting role change", error);
      setMessage("Failed to send role change request");
    }
  };

  return (
    <MainNav>
      <Container className="mt-4">
        <h2>User Profile</h2>
        {message && <Alert variant="info">{message}</Alert>}
        <Form onSubmit={handleProfileSubmit}>
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Profile Picture</Form.Label>
                <div>
                  <Image
                    src={
                      preview ||
                      (user?.profile_picture
                        ? `${
                            import.meta.env.VITE_URL
                          }/uploads/profile_pictures/${user.profile_picture}`
                        : `${
                            import.meta.env.VITE_URL
                          }/uploads/profile_pictures/default_profile.svg`)
                    }
                    roundedCircle
                    width={150}
                    height={150}
                  />
                </div>
                <Form.Control
                  type="file"
                  onChange={(e) => {
                    // Typecast e.target as HTMLInputElement to access .files
                    const target = e.target as HTMLInputElement;
                    if (target.files) {
                      setProfilePicture(target.files[0]);
                    }
                  }}
                />
              </Form.Group>
            </Col>
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Leave blank to keep current password"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Confirm New Password</Form.Label>
                <Form.Control
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>Current Role</Form.Label>
            <Form.Control
              type="text"
              value={`${user?.role} - ${getRoleDescription(user?.role)}`}
              readOnly
            />
          </Form.Group>
          <Button type="submit" variant="primary">
            Update Profile
          </Button>
        </Form>

        <hr />

        <h4>Request Role Change / Message Admin/PM</h4>
        <Form.Group className="mb-3">
          <Form.Label>Message</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={roleRequestMessage}
            onChange={(e) => setRoleRequestMessage(e.target.value)}
            placeholder="Enter your request message"
          />
        </Form.Group>
        <Button onClick={handleRoleRequest} variant="secondary">
          Send Request
        </Button>

        <hr />

        <h4>Feedback and Support</h4>
        <p>
          If you encounter issues or have feedback, please submit an issue on
          our{" "}
          <a
            href="https://github.com/jaco8060/TaskMaster/issues"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub page
          </a>
          .
        </p>
      </Container>
    </MainNav>
  );
};

function getRoleDescription(role: string | undefined) {
  switch (role) {
    case "admin":
      return "Has full access to the system.";
    case "pm":
      return "Can manage projects and assign personnel.";
    case "developer":
      return "Can work on assigned tasks and tickets.";
    case "submitter":
      return "Can submit tickets and view their own issues.";
    default:
      return "";
  }
}

export default UserProfile;
