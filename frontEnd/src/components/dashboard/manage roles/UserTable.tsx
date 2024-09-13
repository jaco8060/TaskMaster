import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../contexts/AuthProvider";
import DataTable from "../../../hooks/DataTable";

// Define types for the props and user
interface UserTableProps {
  refresh: boolean;
}

interface User {
  id: number;
  role: string;
  username: string;
  email: string;
}

const UserTable: React.FC<UserTableProps> = ({ refresh }) => {
  const { user } = useContext(AuthContext) as { user: User }; // Get the current logged-in user and cast to User type
  const columns = [
    { header: "Username", accessor: "username" },
    { header: "Email", accessor: "email" },
    { header: "Role", accessor: "role" },
  ];

  const searchFields = ["username", "email", "role"];
  const [key, setKey] = useState<number>(0);

  useEffect(() => {
    setKey((prev) => prev + 1);
  }, [refresh]);

  return (
    <div>
      <h3>Your Personnel</h3>
      <DataTable
        key={key} // Changing the key will force DataTable to remount and fetch new data
        endpoint={`${import.meta.env.VITE_URL}/users?assigned_by=${user.id}`}
        columns={columns}
        searchFields={searchFields}
      />
    </div>
  );
};

export default UserTable;
