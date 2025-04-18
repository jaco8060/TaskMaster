// frontEnd/src/hooks/UserSelector.tsx
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  InputGroup,
  Row,
  Spinner,
  Table,
  Toast,
} from "react-bootstrap";
import "../styles/hooks/UserSelector.scss";

interface UserSelectorProps {
  endpoint: string;
  onAssign: (userIds: number[], role?: string) => void;
  roleSelection?: boolean;
  // New prop: list of usernames that cannot be selected.
  disabledUsernames?: string[];
}

interface User {
  id: number;
  username: string;
  email: string;
}

const UserSelector: React.FC<UserSelectorProps> = ({
  endpoint,
  onAssign,
  roleSelection = false,
  disabledUsernames = [],
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [role, setRole] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(endpoint, { withCredentials: true });
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
      setLoading(false);
    };

    fetchUsers();
  }, [endpoint]);

  const handleSelectUser = (userId: number, username: string) => {
    // If this user is in the disabled list, do nothing.
    if (disabledUsernames.includes(username)) return;
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const handleRoleChange = (event: React.ChangeEvent<any>) => {
    setRole(event.target.value);
  };

  const handleAssign = () => {
    if (selectedUsers.length > 0) {
      if (roleSelection) {
        onAssign(selectedUsers, role);
      } else {
        onAssign(selectedUsers);
      }
    } else {
      setShowToast(true);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      (user.username &&
        user.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.email &&
        user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="user-selector">
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
          Please select at least one user
        </Toast.Body>
      </Toast>
      <Row className="search-container mb-3">
        <Col xs={12} md={6} className="d-flex align-items-center">
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Search users"
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyPress={handleKeyPress}
            />
            <Button
              variant="secondary"
              className="clear-button"
              onClick={() => setSearchTerm("")}
            >
              Clear
            </Button>
          </InputGroup>
        </Col>
      </Row>
      {loading ? (
        <div className="spinner-container">
          <Spinner animation="border" />
        </div>
      ) : (
        <div className="user-selector-table-container">
          <Table responsive hover className="user-list-table">
            <thead>
              <tr className="table-dark table-active text-uppercase text-white text-nowrap">
                <th>Username</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const isDisabled = disabledUsernames.includes(user.username);
                return (
                  <tr
                    key={user.id}
                    onClick={() => handleSelectUser(user.id, user.username)}
                    className={`user-list-table-row ${
                      selectedUsers.includes(user.id) ? "selected" : ""
                    } ${isDisabled ? "disabled" : ""}`}
                    style={{ cursor: isDisabled ? "not-allowed" : "pointer" }}
                  >
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      )}
      {roleSelection && (
        <Row className="role-selection-container mb-3">
          <Col xs={12} md={12}>
            <Form.Group controlId="roleSelect" className="role-selection-group">
              <Form.Label className="form-label">
                Select the role to assign:
              </Form.Label>
              <div className="role-control-container">
                <Form.Control
                  as="select"
                  value={role}
                  onChange={handleRoleChange}
                  className="form-control role-dropdown"
                >
                  <option value="">~Select Role~</option>
                  <option value="developer">Developer</option>
                  <option value="submitter">Submitter</option>
                  <option value="pm">Project Manager</option>
                </Form.Control>
                <Button
                  variant="primary"
                  onClick={handleAssign}
                  className="assign-button"
                  disabled={selectedUsers.length === 0 || role === ""}
                >
                  Assign
                </Button>
              </div>
            </Form.Group>
          </Col>
        </Row>
      )}
      {!roleSelection && (
        <Button
          variant="primary"
          onClick={handleAssign}
          className="mt-3"
          disabled={selectedUsers.length === 0}
        >
          Assign Selected Users
        </Button>
      )}
    </div>
  );
};

export default UserSelector;
