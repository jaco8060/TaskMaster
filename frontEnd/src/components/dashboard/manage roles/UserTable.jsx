import React, { useEffect, useState } from "react";
import DataTable from "../../../hooks/DataTable";

const UserTable = ({ refresh }) => {
  const columns = [
    { header: "Username", accessor: "username" },
    { header: "Email", accessor: "email" },
    { header: "Role", accessor: "role" },
  ];

  const searchFields = ["username", "email", "role"];
  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey((prev) => prev + 1);
  }, [refresh]);

  return (
    <div>
      <h3>Your Personnel</h3>
      <DataTable
        key={key} // Changing the key will force DataTable to remount and fetch new data
        endpoint={`${import.meta.env.VITE_URL}/users`}
        columns={columns}
        searchFields={searchFields}
      />
    </div>
  );
};

export default UserTable;
