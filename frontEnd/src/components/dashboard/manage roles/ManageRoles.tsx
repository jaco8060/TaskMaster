import React, { useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { MainNav } from "../NavBars.tsx";
import AssignUserRole from "./AssignUserRole";
import UserTable from "./UserTable.tsx";

const ManageRoles: React.FC = () => {
  const [refresh, setRefresh] = useState<boolean>(false);

  const handleRefresh = () => {
    setRefresh((prev) => !prev);
  };

  return (
    <MainNav>
      <div className="section-container d-flex flex-column">
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
