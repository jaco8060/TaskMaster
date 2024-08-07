import React, { useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { MainNav } from "../NavBars.jsx";
import AssignUserRole from "./AssignUserRole.jsx";
import UserTable from "./UserTable";

const ManageRoles = () => {
  const [refresh, setRefresh] = useState(false);

  const handleRefresh = () => {
    setRefresh((prev) => !prev);
  };

  return (
    <MainNav>
      <div className="p-0 d-flex flex-column">
        <Row>
          <Col>
            <h1 className="mb-3">Manage Role Assignment</h1>
          </Col>
        </Row>
        <Row>
          <Col xs={10} sm={12} className="p-0">
            <AssignUserRole onRoleAssigned={handleRefresh} />
          </Col>
        </Row>
        <Row>
          <Col xs={10} sm={12}>
            <UserTable refresh={refresh} />
          </Col>
        </Row>
      </div>
    </MainNav>
  );
};

export default ManageRoles;
