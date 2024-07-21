import React, { useContext, useEffect } from "react";
import { Col, Nav, Row, Tab } from "react-bootstrap";
import {
  FaHome,
  FaTasks,
  FaTicketAlt,
  FaUser,
  FaUserShield,
  FaUsers,
} from "react-icons/fa"; // Import the icons
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthProvider.jsx";
import "../../styles/NavBars.scss"; // Import the SCSS file

const UserTabs = ({ activeTab, handleSelect }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Set the active tab based on the URL path
    const pathToTab = {
      "/dashboard": "first",
      "/manage-roles": "second",
      "/myprojects": "third",
      "/mytickets": "fourth",
      "/userprofile": "fifth",
    };

    const currentTab = pathToTab[location.pathname];
    if (currentTab) {
      handleSelect(currentTab);
    }
  }, [location.pathname]);

  const handleNavSelect = (eventKey) => {
    handleSelect(eventKey); // Set the active tab
  };

  const tabs = {
    admin: [
      {
        eventKey: "first",
        title: "Dashboard Home",
        icon: FaHome,
        onClick: () => navigate("/dashboard"),
      },
      {
        eventKey: "second",
        title: "Manage Role Assignment",
        icon: FaUserShield,
        onClick: () => navigate("/manage-roles"),
      },
      {
        eventKey: "third",
        title: "My Projects",
        icon: FaTasks,
        onClick: () => navigate("/myprojects"),
      },
      {
        eventKey: "fourth",
        title: "My Tickets",
        icon: FaTicketAlt,
        onClick: () => navigate("/mytickets"),
      },
      {
        eventKey: "fifth",
        title: "User Profile",
        icon: FaUser,
        onClick: () => navigate("/userprofile"),
      },
    ],
    pm: [
      {
        eventKey: "first",
        title: "Dashboard Home",
        icon: FaHome,
        onClick: () => navigate("/dashboard"),
      },
      {
        eventKey: "second",
        title: "My Projects",
        icon: FaTasks,
        onClick: () => navigate("/myprojects"),
      },
      {
        eventKey: "third",
        title: "User Profile",
        icon: FaUser,
        onClick: () => navigate("/userprofile"),
      },
    ],
    submitter: [
      {
        eventKey: "first",
        title: "Dashboard Home",
        icon: FaHome,
        onClick: () => navigate("/dashboard"),
      },
      {
        eventKey: "second",
        title: "My Projects",
        icon: FaTasks,
        onClick: () => navigate("/myprojects"),
      },
      {
        eventKey: "third",
        title: "My Tickets",
        icon: FaTicketAlt,
        onClick: () => navigate("/mytickets"),
      },
      {
        eventKey: "fourth",
        title: "User Profile",
        icon: FaUser,
        onClick: () => navigate("/userprofile"),
      },
    ],
    developer: [
      {
        eventKey: "first",
        title: "Dashboard Home",
        icon: FaHome,
        onClick: () => navigate("/dashboard"),
      },
      {
        eventKey: "second",
        title: "My Projects",
        icon: FaTasks,
        onClick: () => navigate("/myprojects"),
      },
      {
        eventKey: "third",
        title: "My Tickets",
        icon: FaTicketAlt,
        onClick: () => navigate("/mytickets"),
      },
      {
        eventKey: "fourth",
        title: "User Profile",
        icon: FaUser,
        onClick: () => navigate("/userprofile"),
      },
    ],
  };

  const userTabs = tabs[user.role] || [];

  return (
    <Tab.Container activeKey={activeTab} onSelect={handleNavSelect}>
      <Row>
        <Col>
          <Nav variant="pills" className="flex-column text-nowrap">
            {userTabs.map((tab) => (
              <Nav.Item key={tab.eventKey}>
                <Nav.Link eventKey={tab.eventKey} onClick={tab.onClick}>
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
