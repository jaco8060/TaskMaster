import axios from "axios";
import React from "react";
import { Container } from "react-bootstrap";
import UserSelector from "../../../hooks/UserSelector";

const AssignUserRole = ({ onRoleAssigned }) => {
  const handleAssignRole = async (userIds, role) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_URL}/users/assign-role`,
        { userIds, role },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      onRoleAssigned();
    } catch (error) {
      console.error("Error assigning role:", error);
      alert("Failed to assign role.");
    }
  };

  return (
    <Container fluid>
      <h5>Select 1 or more users to assign a role:</h5>
      <UserSelector
        endpoint={`${import.meta.env.VITE_URL}/users`}
        onAssign={handleAssignRole}
        roleSelection={true} // Enable role selection
      />
    </Container>
  );
};

export default AssignUserRole;
