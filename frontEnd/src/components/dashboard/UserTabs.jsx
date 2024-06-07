import React, { useContext } from "react";
import { Col, Nav, Row, Tab } from "react-bootstrap";
import {
  FaHome,
  FaTasks,
  FaTicketAlt,
  FaUser,
  FaUserShield,
  FaUsers,
} from "react-icons/fa"; // Import the icons
import { AuthContext } from "../../contexts/AuthProvider.jsx";
import "../../styles/NavBars.scss"; // Import the SCSS file

const UserTabs = ({ activeTab, handleSelect }) => {
  const { user } = useContext(AuthContext);

  const tabs = {
    admin: [
      { eventKey: "first", title: "Dashboard Home", icon: FaHome },
      {
        eventKey: "second",
        title: "Manage Role Assignment",
        icon: FaUserShield,
      },
      { eventKey: "third", title: "Manage Project Users", icon: FaUsers },
      { eventKey: "fourth", title: "My Projects", icon: FaTasks },
      { eventKey: "fifth", title: "My Tickets", icon: FaTicketAlt },
      { eventKey: "sixth", title: "User Profile", icon: FaUser },
    ],
    pm: [
      { eventKey: "first", title: "Dashboard Home", icon: FaHome },
      { eventKey: "second", title: "Manage Project Users", icon: FaUsers },
      { eventKey: "third", title: "My Projects", icon: FaTasks },
      { eventKey: "fourth", title: "User Profile", icon: FaUser },
    ],
    submitter: [
      { eventKey: "first", title: "Dashboard Home", icon: FaHome },
      { eventKey: "second", title: "My Projects", icon: FaTasks },
      { eventKey: "third", title: "My Tickets", icon: FaTicketAlt },
      { eventKey: "fourth", title: "User Profile", icon: FaUser },
    ],
    developer: [
      { eventKey: "first", title: "Dashboard Home", icon: FaHome },
      { eventKey: "second", title: "My Projects", icon: FaTasks },
      { eventKey: "third", title: "My Tickets", icon: FaTicketAlt },
      { eventKey: "fourth", title: "User Profile", icon: FaUser },
    ],
  };

  const userTabs = tabs[user.role] || [];

  return (
    <Tab.Container activeKey={activeTab} onSelect={handleSelect}>
      <Row>
        <Col>
          <Nav variant="pills" className="flex-column">
            {userTabs.map((tab) => (
              <Nav.Item key={tab.eventKey}>
                <Nav.Link eventKey={tab.eventKey}>
                  <tab.icon size={23} className="me-3" />
                  {tab.title}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
        </Col>
      </Row>
    </Tab.Container>
  );
};

export default UserTabs;
