import React, { useContext, useState } from "react";
import { Button } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthProvider.jsx";
import DataTable from "../../../hooks/DataTable";
import "../../../styles/ManageProjectUsers.scss"; // Import custom CSS
import { MainNav } from "../NavBars.jsx";

const ManageProjectUsers = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // Get the current logged-in user
  const [refresh, setRefresh] = useState(false);

  const handleRefresh = () => {
    setRefresh((prev) => !prev);
  };

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
      <div className="p-0 d-flex flex-column">
        <Row>
          <Col>
            <h1 className="mb-3">Manage Project Users</h1>
          </Col>
        </Row>
        <Row>
          <Col className="p-0 d-flex">
            <div className="data-table-container">
              <DataTable
                endpoint={endpoint}
                columns={columns}
                searchFields={searchFields}
                refresh={refresh}
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={12} className="d-flex  mt-3">
            <Button size="lg" onClick={() => navigate("/myprojects")}>
              Goto My Projects
            </Button>
          </Col>
        </Row>
      </div>
    </MainNav>
  );
};

export default ManageProjectUsers;
