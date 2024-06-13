import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Col, Form, ListGroup, Row } from "react-bootstrap";

const UserList = ({ onRoleAssigned }) => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [role, setRole] = useState("~Select Role~");
  const [loading, setLoading] = useState(false);
  const endpoint = `${import.meta.env.VITE_URL}/users`;

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(endpoint);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
      setLoading(false);
    };

    fetchUsers();
  }, [endpoint]);

  const handleSelectUser = (userId) => {
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
        }
      );
      onRoleAssigned(); // Trigger refresh in parent component
    } catch (error) {
      console.error("Error assigning role:", error);
      alert("Failed to assign role.");
    }
  };

  return (
    <div>
      <div>
        <h6>Select 1 or more users:</h6>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div style={{ maxHeight: "200px", overflowY: "auto" }}>
            <ListGroup>
              {users.map((user) => (
                <ListGroup.Item
                  key={user.id}
                  active={selectedUsers.includes(user.id)}
                  onClick={() => handleSelectUser(user.id)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="d-flex justify-content-between">
                    <span>{user.username}</span>
                    <span>{user.email}</span>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        )}
      </div>

      <Row className="mb-3">
        <Col xs={12} md={6} className="d-flex align-items-center gap-2 mt-3">
          <Form.Group
            controlId="roleSelect"
            className="d-flex align-items-center mb-0 gap-2"
          >
            <Form.Label className="mr-2 mb-0 text-nowrap">
              Select the role to assign:
            </Form.Label>

            <Form.Control
              as="select"
              value={role}
              onChange={handleRoleChange}
              className="ml-2"
              style={{ width: "150px" }}
            >
              <option>~Select Role~</option>
              <option value="submitter">Submitter</option>
              <option value="developer">Developer</option>
              <option value="project_manager">Project Manager</option>
            </Form.Control>
          </Form.Group>
          <Button
            variant="primary"
            className="ml-2"
            onClick={handleAssignRole}
            disabled={selectedUsers.length === 0 || role === "~Select Role~"}
          >
            Assign
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default UserList;