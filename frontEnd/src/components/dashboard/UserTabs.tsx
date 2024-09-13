import React, { useContext, useEffect } from "react";
import { Col, Nav, Row, Tab } from "react-bootstrap";
import { IconType } from "react-icons";
import {
  FaHome,
  FaTasks,
  FaTicketAlt,
  FaUser,
  FaUserShield,
} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthProvider";
import "../../styles/dashboard/NavBars.scss";

// Define types for props
interface UserTabsProps {
  activeTab: string;
  handleSelect: (key: string) => void;
}

// Define the available roles
type UserRole = "admin" | "pm" | "submitter" | "developer";

// Define the shape of the tabs for each role
interface TabItem {
  eventKey: string;
  title: string;
  icon: IconType;
}

const UserTabs: React.FC<UserTabsProps> = ({ activeTab, handleSelect }) => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("UserTabs must be used within an AuthProvider");
  }

  const { user } = context;
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) return;

    const roleToPathMap: Record<UserRole, Record<string, string>> = {
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
        "/mytickets": "third",
        "/userprofile": "fourth",
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

    const currentTab =
      roleToPathMap[user.role as UserRole]?.[location.pathname];
    if (currentTab) {
      handleSelect(currentTab);
    }
  }, [location.pathname, user, handleSelect]);

  const handleNavSelect = (eventKey: string | null) => {
    if (!user) return;

    if (eventKey) {
      handleSelect(eventKey);

      const tabToPathMap: Record<UserRole, Record<string, string>> = {
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

      const path = tabToPathMap[user.role as UserRole][eventKey];
      navigate(path);
    }
  };

  if (!user) {
    return null; // Or render a fallback UI if user is not available
  }

  const tabs: Record<UserRole, TabItem[]> = {
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

  const userTabs = tabs[user.role as UserRole] || [];

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
