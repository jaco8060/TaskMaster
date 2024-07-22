import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import "../../../styles/dashboard/UserList.scss"; // Import custom CSS for styling

const UserList = ({ onRoleAssigned }) => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [role, setRole] = useState("~Select Role~");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const endpoint = `${import.meta.env.VITE_URL}/users`;

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

  const handleSelectUser = (userId) => {
    const user = users.find((user) => user.id === userId);
    if (user && (user.role === "admin" || user.role === "pm")) {
      alert("You cannot change the role of admin or project manager.");
      return;
    }
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handleAssignRole = async () => {
    try {
      await axios.post(
        `${endpoint}/assign-role`,
        {
          userIds: selectedUsers,
          role,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      onRoleAssigned(); // Trigger refresh in parent component
    } catch (error) {
      console.error("Error assigning role:", error);
      alert("Failed to assign role.");
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredUsers = users.filter(
    (user) =>
      (user.username &&
        user.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.email &&
        user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Container fluid>
      <div>
        <h5>Select 1 or more users:</h5>
        <Row className="mb-3">
          <Col xs={12} md={6} className="d-flex align-items-center">
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Search users"
                value={searchTerm}
                onChange={handleSearchChange}
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
              <tr>
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
      </div>

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
                <option>~Select Role~</option>
                <option value="submitter">Submitter</option>
                <option value="developer">Developer</option>
                <option value="project_manager">Project Manager</option>
              </Form.Control>
              <Button
                variant="primary"
                onClick={handleAssignRole}
                disabled={
                  selectedUsers.length === 0 ||
                  role === "~Select Role~" ||
                  selectedUsers.some(
                    (userId) =>
                      users.find((user) => user.id === userId)?.role ===
                        "admin" ||
                      users.find((user) => user.id === userId)?.role === "pm"
                  )
                }
              >
                Assign
              </Button>
            </div>
          </Form.Group>
        </Col>
      </Row>
    </Container>
  );
};

export default UserList;
