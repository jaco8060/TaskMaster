import React, { useContext } from "react";
import { Col, Nav, Row, Tab } from "react-bootstrap";
import { AuthContext } from "../../contexts/AuthProvider.jsx";
import "../../styles/NavBars.scss"; // Import the SCSS file

const UserTabs = () => {
  const { user } = useContext(AuthContext);

  const tabs = {
    admin: [
      { eventKey: "first", title: "Dashboard Home" },
      { eventKey: "second", title: "Manage Role Assignment" },
      { eventKey: "third", title: "Manage Project Users" },
      { eventKey: "fourth", title: "My Projects" },
      { eventKey: "fifth", title: "My Tickets" },
      { eventKey: "sixth", title: "User Profile" },
    ],
    pm: [
      { eventKey: "first", title: "Dashboard Home" },
      { eventKey: "second", title: "Manage Project Users" },
      { eventKey: "third", title: "My Projects" },
      { eventKey: "fourth", title: "User Profile" },
    ],
    submitter: [
      { eventKey: "first", title: "Dashboard Home" },
      { eventKey: "second", title: "My Projects" },
      { eventKey: "third", title: "My Tickets" },
      { eventKey: "fourth", title: "User Profile" },
    ],
    developer: [
      { eventKey: "first", title: "Dashboard Home" },
      { eventKey: "second", title: "My Projects" },
      { eventKey: "third", title: "My Tickets" },
      { eventKey: "fourth", title: "User Profile" },
    ],
  };

  //use active user role
  const userTabs = tabs[user.role] || [];

  return (
    <Tab.Container defaultActiveKey="first">
      <Row>
        <Col>
          <Nav variant="pills" className="flex-column">
            {userTabs.map((tab) => (
              <Nav.Item key={tab.eventKey}>
                <Nav.Link eventKey={tab.eventKey}>{tab.title}</Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
        </Col>
      </Row>
    </Tab.Container>
  );
};

export default UserTabs;
