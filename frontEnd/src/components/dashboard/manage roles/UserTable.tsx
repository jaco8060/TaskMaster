// frontEnd/src/components/dashboard/manage roles/UserTable.tsx
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../contexts/AuthProvider";
import DataTable from "../../../hooks/DataTable";

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
      alert("Failed to remove role assignment.");
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
