import React, { useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { MainNav } from "../NavBars.jsx";
import UserList from "./UserList";
import UserTable from "./UserTable";

const ManageRoles = () => {
  const [refresh, setRefresh] = useState(false);

  const handleRefresh = () => {
    setRefresh((prev) => !prev);
  };

  return (
    <MainNav>
      <Container fluid>
        <Row>
          <h1 className="mb-3">Manage Role Assignment</h1>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={12}>
            <UserList onRoleAssigned={handleRefresh} />
          </Col>
          <Col xs={12} sm={12} md={12}>
            <UserTable refresh={refresh} />
          </Col>
        </Row>
      </Container>
    </MainNav>
  );
};

export default ManageRoles;
