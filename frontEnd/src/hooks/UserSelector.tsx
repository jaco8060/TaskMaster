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
} from "react-bootstrap";
import { FaSearch, FaTimes } from "react-icons/fa"; // Optional: Import icons if you want to update the search input
import "../styles/hooks/UserSelector.scss"; // Import the CSS file

// Define the types for props
interface UserSelectorProps {
  endpoint: string;
  onAssign: (userIds: number[], role?: string) => void;
  roleSelection?: boolean;
}

// Define the types for user object
interface User {
  id: number;
  username: string;
  email: string;
}

const UserSelector: React.FC<UserSelectorProps> = ({
  endpoint,
  onAssign,
  roleSelection = false,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [role, setRole] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

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

  const handleSelectUser = (userId: number) => {
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
        onAssign(selectedUsers, role); // Passing number[]
      } else {
        onAssign(selectedUsers); // Passing number[]
      }
    } else {
      alert("Please select at least one user.");
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
    <>
      <Row className="mb-3">
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
              className="text-primary-subtle flex-shrink-0"
              onClick={() => setSearchTerm("")}
            >
              Clear
            </Button>
          </InputGroup>
        </Col>
      </Row>
      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "200px" }}
        >
          <Spinner animation="border" />
        </div>
      ) : (
        <Table responsive hover className="user-list-table">
          <thead>
            <tr className="table-dark table-active text-uppercase text-white text-nowrap">
              <th>Username</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                onClick={() => handleSelectUser(user.id)}
                className={`user-list-table-row ${
                  selectedUsers.includes(user.id) ? "selected" : ""
                }`}
              >
                <td>{user.username}</td>
                <td>{user.email}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      {roleSelection && (
        <Row className="mb-3">
          <Col
            xs={12}
            md={12}
            className="d-flex align-items-start flex-column gap-2 mt-3"
          >
            <Form.Group
              controlId="roleSelect"
              className="d-flex align-items-center mb-0 gap-2 flex-column flex-md-row"
            >
              <Form.Label className="mb-0 text-nowrap">
                Select the role to assign:
              </Form.Label>
              <div className="d-flex flex-column flex-md-row w-100 gap-2">
                <Form.Control
                  as="select"
                  value={role}
                  onChange={handleRoleChange}
                  style={{ maxWidth: "150px" }}
                >
                  <option value="">~Select Role~</option>
                  <option value="developer">Developer</option>
                  <option value="submitter">Submitter</option>
                  <option value="pm">Project Manager</option>
                </Form.Control>
                <Button
                  variant="primary"
                  onClick={handleAssign}
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
    </>
  );
};

export default UserSelector;
