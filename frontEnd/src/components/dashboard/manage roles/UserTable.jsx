import React from "react";
import DataTable from "../../../hooks/DataTable";

const UserTable = () => {
  const columns = [
    { header: "ID", accessor: "id" },
    { header: "Username", accessor: "username" },
    { header: "Email", accessor: "email" },
    { header: "Role", accessor: "role" },
  ];

  const searchFields = ["username", "email", "role"];

  return (
    <div>
      <h1>User Table</h1>
      <DataTable
        endpoint={`${import.meta.env.VITE_URL}/users`}
        columns={columns}
        searchFields={searchFields}
      />
    </div>
  );
};

export default UserTable;

//
