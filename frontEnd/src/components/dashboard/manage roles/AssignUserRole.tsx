// frontEnd/src/components/dashboard/manage roles/AssignUserRole.tsx
import axios from "axios";
import React, { useContext } from "react";
import { Container } from "react-bootstrap";
import { AuthContext } from "../../../contexts/AuthProvider";
import UserSelector from "../../../hooks/UserSelector";

interface AssignUserRoleProps {
  onRoleAssigned: () => void; // Callback to refresh the personnel list
}

const AssignUserRole: React.FC<AssignUserRoleProps> = ({ onRoleAssigned }) => {
  const { user } = useContext(AuthContext)!;
  // Only for the demo_admin user, we want to disable changes to any demo accounts.
  const demoUsernames = ["demo_admin", "demo_sub", "demo_dev", "demo_pm"];

  const handleAssignRole = async (
    userIds: number[],
    role?: string
  ): Promise<void> => {
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
      {/* If the current user is demo_admin, pass the list of demoUsernames to disable */}
      <UserSelector
        endpoint={`${import.meta.env.VITE_URL}/users`}
        onAssign={handleAssignRole}
        roleSelection={true}
        disabledUsernames={user?.username === "demo_admin" ? demoUsernames : []}
      />
    </Container>
  );
};

export default AssignUserRole;
