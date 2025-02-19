// frontEnd/src/components/dashboard/manage roles/UserTable.tsx
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../contexts/AuthProvider";
import DataTable from "../../../hooks/DataTable";
import Toast from "react-bootstrap/Toast";

interface UserTableProps {
  refresh: boolean;
  onRoleChanged: () => void;
}

interface User {
  id: number;
  role: string;
  username: string;
  email: string;
}

const UserTable: React.FC<UserTableProps> = ({ refresh, onRoleChanged }) => {
  const { user } = useContext(AuthContext) as { user: User };

  // Add an "Actions" column
  const columns = [
    { header: "Username", accessor: "username" },
    { header: "Email", accessor: "email" },
    { header: "Role", accessor: "role" },
    { header: "Actions", accessor: "actions", sortable: false },
  ];

  const searchFields = ["username", "email", "role"];
  const [key, setKey] = useState<number>(0);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Refresh the DataTable when refresh prop changes
  useEffect(() => {
    setKey((prev) => prev + 1);
  }, [refresh]);

  // Handler to remove the role assignment for a user
  const handleRemoveRole = async (userId: number) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_URL}/users/assign-role/${userId}`,
        { withCredentials: true }
      );
      onRoleChanged();
    } catch (error) {
      console.error("Error removing role:", error);
      setToastMessage("Failed to remove role assignment.");
      setShowErrorToast(true);
    }
  };

  // Render a cell for the "Actions" column
  const renderCell = (item: any, accessor: string) => {
    if (accessor === "actions") {
      return (
        <div className="d-flex justify-content-end">
          <button
            className="btn btn-danger btn-sm "
            onClick={() => handleRemoveRole(item.id)}
          >
            Remove
          </button>
        </div>
      );
    }
    return item[accessor as keyof User];
  };

  return (
    <div>
      <Toast
        onClose={() => setShowErrorToast(false)}
        show={showErrorToast}
        delay={3000}
        autohide
        bg="danger"
        className="position-fixed top-0 start-50 translate-middle-x mt-3"
      >
        <Toast.Header>
          <strong className="me-auto">Error</strong>
        </Toast.Header>
        <Toast.Body className="text-white">{toastMessage}</Toast.Body>
      </Toast>
      <h3>Your Personnel</h3>
      <DataTable
        key={key}
        endpoint={`${import.meta.env.VITE_URL}/users?assigned_by=${user.id}`}
        columns={columns}
        searchFields={searchFields}
        renderCell={renderCell}
      />
    </div>
  );
};

export default UserTable;
