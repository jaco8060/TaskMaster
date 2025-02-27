// frontEnd/src/components/dashboard/manage roles/ManageRoles.tsx
import React, { useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { MainNav } from "../NavBars";
import AssignUserRole from "./AssignUserRole";
import UserTable from "./UserTable";

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
