// frontEnd/src/components/dashboard/manage roles/UserTable.tsx
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../contexts/AuthProvider";
import DataTable from "../../../hooks/DataTable";
import Toast from "react-bootstrap/Toast";

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
  const { user } = useContext(AuthContext) as { user: User };
  const [members, setMembers] = useState<any[]>([]);
  
  // Simplified columns without actions
  const columns = [
    { header: "Username", accessor: "username" },
    { header: "Email", accessor: "email" },
    { header: "Role", accessor: "role" },
  ];

  const searchFields = ["username", "email", "role"];
  const [key, setKey] = useState<number>(0);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Fetch organization members
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_URL}/organizations/my`,
          { withCredentials: true }
        );
        setMembers(response.data.members);
      } catch (error) {
        console.error("Error fetching organization members:", error);
      }
    };

    fetchMembers();
  }, [refresh]); // Refresh when parent component triggers

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
      <h3>Organization Members</h3>
      <DataTable
        key={key}
        staticData={members}
        columns={columns}
        searchFields={searchFields}
      />
    </div>
  );
};

export default UserTable;
