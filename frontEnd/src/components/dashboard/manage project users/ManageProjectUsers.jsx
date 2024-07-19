import React, { useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthProvider.jsx";
import DataTable from "../../../hooks/DataTable";
import { MainNav } from "../NavBars.jsx";
const ManageProjectUsers = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // Get the current logged-in user
  const columns = [
    { header: "Project Name", accessor: "name" },
    { header: "Description", accessor: "description" },
    { header: "Created At", accessor: "created_at" },
    { header: "Is Active", accessor: "is_active" },
  ];

  const searchFields = ["name", "description"];

  const endpoint = `${import.meta.env.VITE_URL}/projects?user_id=${user.id}`;

  return (
    <MainNav>
      <div>
        <h1 className="mb-3">Manage Project Users</h1>

        <DataTable
          endpoint={endpoint}
          columns={columns}
          searchFields={searchFields}
        />
      </div>
      <div className="d-flex">
        <Button
          className="mx-auto"
          size="lg"
          onClick={() => navigate("/projects")}
        >
          Goto My Projects
        </Button>
      </div>
    </MainNav>
  );
};

export default ManageProjectUsers;
