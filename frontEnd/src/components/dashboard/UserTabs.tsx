// UserTabs.tsx
import React, { useContext, useEffect } from "react";
import { Col, Nav, Row, Tab } from "react-bootstrap";
import { IconType } from "react-icons";
import {
  FaBuilding,
  FaHome,
  FaTasks,
  FaTicketAlt,
  FaUser,
  FaUserShield,
} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthProvider";
import "../../styles/dashboard/NavBars.scss";

interface UserTabsProps {
  activeTab: string;
  handleSelect: (key: string) => void;
}

type UserRole = "admin" | "pm" | "submitter" | "developer";

interface TabItem {
  eventKey: string;
  title: string;
  icon: IconType;
}

const UserTabs: React.FC<UserTabsProps> = ({ activeTab, handleSelect }) => {
  const { user } = useContext(AuthContext)!;
  // Directly use the role stored in the database (which should be one of: admin, pm, submitter, developer)
  const effectiveRole = user?.role as UserRole;
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const pathToTabMap: Record<UserRole, Record<string, string>> = {
      admin: {
        "/dashboard": "first",
        "/manage-roles": "second",
        "/myprojects": "third",
        "/mytickets": "fourth",
        "/userprofile": "fifth",
        "/myorganization": "sixth",
      },
      pm: {
        "/dashboard": "first",
        "/myprojects": "second",
        "/mytickets": "third",
        "/userprofile": "fourth",
        "/myorganization": "fifth",
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

    const currentTab = pathToTabMap[effectiveRole]?.[location.pathname];
    if (currentTab) {
      handleSelect(currentTab);
    }
  }, [location.pathname, effectiveRole, handleSelect]);

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
          sixth: "/myorganization",
        },
        pm: {
          first: "/dashboard",
          second: "/myprojects",
          third: "/mytickets",
          fourth: "/userprofile",
          fifth: "/myorganization",
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
      const path = tabToPathMap[effectiveRole][eventKey];
      navigate(path);
    }
  };

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
      { eventKey: "sixth", title: "My Organization", icon: FaBuilding },
    ],
    pm: [
      { eventKey: "first", title: "Dashboard Home", icon: FaHome },
      { eventKey: "second", title: "My Projects", icon: FaTasks },
      { eventKey: "third", title: "My Tickets", icon: FaTicketAlt },
      { eventKey: "fourth", title: "User Profile", icon: FaUser },
      { eventKey: "fifth", title: "My Organization", icon: FaBuilding },
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

  const userTabs = tabs[effectiveRole] || [];

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
