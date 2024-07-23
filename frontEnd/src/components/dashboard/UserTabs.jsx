import React, { useContext, useEffect } from "react";
import { Col, Nav, Row, Tab } from "react-bootstrap";
import {
  FaHome,
  FaTasks,
  FaTicketAlt,
  FaUser,
  FaUserShield,
} from "react-icons/fa"; // Import the icons
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthProvider.jsx";
import "../../styles/dashboard/NavBars.scss"; // Import the SCSS file

const UserTabs = ({ activeTab, handleSelect }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Define the path to tab mapping based on user role
    const roleToPathMap = {
      admin: {
        "/dashboard": "first",
        "/manage-roles": "second",
        "/myprojects": "third",
        "/mytickets": "fourth",
        "/userprofile": "fifth",
      },
      pm: {
        "/dashboard": "first",
        "/myprojects": "second",
        "/userprofile": "third",
      },
      submitter: {
        "/dashboard": "first",
        "/myprojects": "second",
        "/mytickets": "third",
        "/userprofile": "fourth",
      },
      developer: {
        "/dashboard": "first",
        "/myprojects": "second",
        "/mytickets": "third",
        "/userprofile": "fourth",
      },
    };

    const currentTab = roleToPathMap[user.role]?.[location.pathname];
    if (currentTab) {
      handleSelect(currentTab);
    }
  }, [location.pathname, user.role]);

  const handleNavSelect = (eventKey) => {
    handleSelect(eventKey);
    const tabToPathMap = {
      admin: {
        first: "/dashboard",
        second: "/manage-roles",
        third: "/myprojects",
        fourth: "/mytickets",
        fifth: "/userprofile",
      },
      pm: {
        first: "/dashboard",
        second: "/myprojects",
        third: "/mytickets",
        fourth: "/userprofile",
      },
      submitter: {
        first: "/dashboard",
        second: "/myprojects",
        third: "/mytickets",
        fourth: "/userprofile",
      },
      developer: {
        first: "/dashboard",
        second: "/myprojects",
        third: "/mytickets",
        fourth: "/userprofile",
      },
    };

    const path = tabToPathMap[user.role][eventKey];
    navigate(path);
  };

  const tabs = {
    admin: [
      { eventKey: "first", title: "Dashboard Home", icon: FaHome },
      {
        eventKey: "second",
        title: "Manage Role Assignment",
        icon: FaUserShield,
      },
      { eventKey: "third", title: "My Projects", icon: FaTasks },
      { eventKey: "fourth", title: "My Tickets", icon: FaTicketAlt },
      { eventKey: "fifth", title: "User Profile", icon: FaUser },
    ],
    pm: [
      { eventKey: "first", title: "Dashboard Home", icon: FaHome },
      { eventKey: "second", title: "My Projects", icon: FaTasks },
      { eventKey: "third", title: "My Tickets", icon: FaTicketAlt },
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
    <Tab.Container activeKey={activeTab} onSelect={handleNavSelect}>
      <Row>
        <Col>
          <Nav variant="pills" className="flex-column text-nowrap">
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
