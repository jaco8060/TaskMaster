import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import {
  FaBell,
  FaEnvelope,
  FaSignOutAlt,
  FaSlidersH,
  FaUser,
  FaUserShield,
} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import TaskMasterIcon from "../../assets/taskmaster-logo.svg";
import { AuthContext, AuthContextType } from "../../contexts/AuthProvider";
import "../../styles/dashboard/NavBars.scss";
import Notifications from "./Notifications";
import UserTabs from "./UserTabs";

interface TopNavBarProps {
  children: React.ReactNode;
}

interface SideNavBarProps {
  children: React.ReactNode;
}

interface MainNavProps {
  children: React.ReactNode;
}

interface User {
  role: "admin" | "pm" | "submitter" | "developer";
}

const TopNavBar: React.FC<TopNavBarProps> = ({ children }) => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext) as AuthContextType;
  const [showMobileNotifModal, setShowMobileNotifModal] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState<number>(0);

  const handleLogout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_URL}/auth/logout`, {
        withCredentials: true,
      });
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      alert("Logout failed");
    }
  };

  // Fetch unread notifications count (for Account dropdown)
  useEffect(() => {
    const fetchNotifCount = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_URL}/notifications?onlyUnread=true`,
          { withCredentials: true }
        );
        setNotificationsCount(response.data.length);
      } catch (error) {
        console.error("Error fetching notifications count", error);
      }
    };
    fetchNotifCount();
  }, []);

  return (
    <>
      <Navbar
        expand="lg"
        className="bg-secondary border-bottom border-primary-subtle"
        sticky="top"
      >
        <Container fluid>
          <div className="d-flex align-items-center gap-3">
            <Navbar.Toggle aria-controls="offcanvasNavbar-expand-lg" />
            <Navbar.Brand href="#">
              <img
                src={TaskMasterIcon}
                alt="TaskMaster Icon"
                width="30"
                height="30"
                className="d-inline-block align-top me-2"
              />
              TaskMaster
            </Navbar.Brand>
          </div>

          <Navbar.Offcanvas
            id="offcanvasNavbar-expand-lg"
            aria-labelledby="offcanvasNavbarLabel-expand-lg"
            placement="start"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title
                id="offcanvasNavbarLabel-expand-lg"
                className="d-flex align-items-center"
              >
                <img
                  src={TaskMasterIcon}
                  alt="TaskMaster Icon"
                  width="30"
                  height="30"
                  className="d-inline-block align-top me-2"
                />
                TaskMaster
              </Offcanvas.Title>
            </Offcanvas.Header>

            <Offcanvas.Body>
              <Form
                className="d-flex me-auto my-2 my-lg-0"
                style={{ width: "auto" }}
              >
                <Form.Control
                  type="search"
                  placeholder="Search"
                  className="me-2"
                  aria-label="Search"
                />
                <Button variant="outline-success">Search</Button>
              </Form>
              <div className="d-flex flex-column d-lg-none justify-content-center">
                <hr />
                <div id="TopNavBarMobile">{children}</div>
              </div>
              <hr />
              {/* Mobile view: use a modal for notifications */}
              <div className="d-flex d-lg-none justify-content-center">
                <div className="d-inline-flex bg-body-tertiary rounded py-2 px-3 justify-content-center gap-4">
                  <Button
                    variant="link"
                    className="no-caret mb-0 p-0"
                    style={{
                      textDecoration: "none",
                      boxShadow: "none",
                      outline: "none",
                    }}
                    onClick={() => setShowMobileNotifModal(true)}
                  >
                    <FaBell size={30} />
                  </Button>
                  {/* For mobile, the Account icon remains as an icon */}
                  <Nav.Link href="#Account" className="mb-0">
                    <FaSlidersH size={30} />
                  </Nav.Link>
                  <Nav.Link
                    href="#logout"
                    className="mb-0"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt size={30} />
                  </Nav.Link>
                </div>
              </div>
              {/* Large screen view */}
              <Nav className="justify-content-end flex-grow-1 pe-3 offcanvas-nav">
                {/* Notifications dropdown */}
                <Dropdown align="end" className="d-none d-lg-inline">
                  <Dropdown.Toggle
                    variant="link"
                    id="dropdown-notifications"
                    className="no-caret p-2"
                    style={{
                      textDecoration: "none",
                      boxShadow: "none",
                      outline: "none",
                    }}
                  >
                    <div className="d-flex align-items-center">
                      <h6 className="mb-0 me-2">Notifications</h6>
                      <FaBell size={25} />
                    </div>
                  </Dropdown.Toggle>
                  <Dropdown.Menu
                    style={{
                      minWidth: "300px",
                      maxHeight: "400px",
                      overflowY: "auto",
                    }}
                  >
                    <Notifications />
                  </Dropdown.Menu>
                </Dropdown>
                {/* Account dropdown with user info */}
                <Dropdown align="end" className="d-none d-lg-inline">
                  <Dropdown.Toggle
                    variant="link"
                    id="dropdown-Account"
                    className="no-caret p-2"
                    style={{
                      textDecoration: "none",
                      boxShadow: "none",
                      outline: "none",
                    }}
                  >
                    <div className="d-flex align-items-center">
                      <h6 className="mb-0 me-2">Account</h6>
                      <FaSlidersH size={25} />
                    </div>
                  </Dropdown.Toggle>
                  <Dropdown.Menu style={{ minWidth: "250px" }}>
                    <Dropdown.ItemText>
                      <div className="d-flex align-items-center">
                        <FaUser size={16} className="me-2" />
                        {user?.username}
                      </div>
                    </Dropdown.ItemText>
                    <Dropdown.ItemText>
                      <div className="d-flex align-items-center">
                        <FaEnvelope size={16} className="me-2" />
                        {user?.email}
                      </div>
                    </Dropdown.ItemText>
                    <Dropdown.ItemText>
                      <div className="d-flex align-items-center">
                        <FaUserShield size={16} className="me-2" />
                        {user?.role}
                      </div>
                    </Dropdown.ItemText>
                    <Dropdown.ItemText>
                      <div className="d-flex align-items-center">
                        <FaBell size={16} className="me-2" />
                        Notifications: {notificationsCount}
                      </div>
                    </Dropdown.ItemText>
                  </Dropdown.Menu>
                </Dropdown>
                <Nav.Link className="d-none d-lg-inline" onClick={handleLogout}>
                  <div className="d-flex align-items-center">
                    <h6 className="mb-0 me-2">Logout</h6>
                    <FaSignOutAlt size={25} />
                  </div>
                </Nav.Link>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>

      {/* Mobile Notifications Modal */}
      <Modal
        show={showMobileNotifModal}
        onHide={() => setShowMobileNotifModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Notifications</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Notifications />
        </Modal.Body>
      </Modal>
    </>
  );
};

const SideNavBar: React.FC<SideNavBarProps> = ({ children }) => {
  return (
    <aside id="SideNavBar">
      <div className="sticky-nav">{children}</div>
    </aside>
  );
};

const MainNav: React.FC<MainNavProps> = ({ children }) => {
  const { user } = useContext(AuthContext) as AuthContextType;
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>("");

  useEffect(() => {
    const pathToTabMap: Record<User["role"], Record<string, string>> = {
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
      pathToTabMap[user?.role as keyof typeof pathToTabMap]?.[
        location.pathname
      ];
    if (currentTab) {
      setActiveTab(currentTab);
    }
  }, [location.pathname, user]);

  const handleSelect = (eventKey: string | null) => {
    setActiveTab(eventKey ?? "");
  };

  return (
    <Container fluid className="p-0 vh-100 d-flex flex-column">
      <TopNavBar>
        <UserTabs activeTab={activeTab} handleSelect={handleSelect} />
      </TopNavBar>
      <Row className="vh-100 g-0">
        <Col xs="auto">
          <SideNavBar>
            <UserTabs activeTab={activeTab} handleSelect={handleSelect} />
          </SideNavBar>
        </Col>
        <Col className="p-0">
          <main className="p-4">{children}</main>
        </Col>
      </Row>
    </Container>
  );
};

export { MainNav, SideNavBar, TopNavBar };
