import axios from "axios";
import React from "react";
import { Container } from "react-bootstrap";
import UserSelector from "../../../hooks/UserSelector.tsx";

interface AssignUserRoleProps {
  onRoleAssigned: () => void; // Function type definition for the onRoleAssigned prop
}

const AssignUserRole: React.FC<AssignUserRoleProps> = ({ onRoleAssigned }) => {
  const handleAssignRole = async (
    userIds: number[],
    role?: string // Make role optional
  ): Promise<void> => {
    try {
      await axios.post(
        `${import.meta.env.VITE_URL}/users/assign-role`,
        { userIds, role }, // Passing role, which may be undefined
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
