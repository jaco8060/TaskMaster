// frontEnd/src/components/dashboard/manage roles/AssignUserRole.tsx
import axios from "axios";
import React, { useContext, useState } from "react";
import { Container, Toast } from "react-bootstrap";
import { AuthContext } from "../../../contexts/AuthProvider";
import UserSelector from "../../../hooks/UserSelector";

interface AssignUserRoleProps {
  onRoleAssigned: () => void; // Callback to refresh the personnel list
}

const AssignUserRole: React.FC<AssignUserRoleProps> = ({ onRoleAssigned }) => {
  const { user } = useContext(AuthContext)!;
  // Only for the demo_admin user, we want to disable changes to any demo accounts.
  const demoUsernames = ["demo_admin", "demo_sub", "demo_dev", "demo_pm"];

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

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
      setToastMessage("Failed to assign role.");
      setShowToast(true);
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
      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={3000}
        autohide
        bg="danger"
        className="position-fixed start-50 translate-middle-x"
        style={{ top: "70px" }}
      >
        <Toast.Header>
          <strong className="me-auto">Error</strong>
        </Toast.Header>
        <Toast.Body className="text-white">{toastMessage}</Toast.Body>
      </Toast>
    </Container>
  );
};

export default AssignUserRole;
