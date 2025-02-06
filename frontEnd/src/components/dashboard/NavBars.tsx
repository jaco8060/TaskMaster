import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import { FaBell, FaCog, FaSignOutAlt } from "react-icons/fa";
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
  const { setUser } = useContext(AuthContext) as AuthContextType;
  const [showMobileNotifModal, setShowMobileNotifModal] = useState(false);

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
                  <Nav.Link href="#settings" className="mb-0">
                    <FaCog size={30} />
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
                <Dropdown align="start">
                  <Dropdown.Toggle
                    variant="link"
                    id="dropdown-notifications"
                    className="no-caret d-none d-lg-inline p-2"
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
                <Nav.Link href="#settings" className="d-none d-lg-inline">
                  <div className="d-flex align-items-center">
                    <h6 className="mb-0 me-2">Settings</h6>
                    <FaCog size={25} />
                  </div>
                </Nav.Link>
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
    <Container
      fluid
      className="p-0 d-flex flex-column"
      style={{ height: "100vh" }}
    >
      <TopNavBar>
        <UserTabs activeTab={activeTab} handleSelect={handleSelect} />
      </TopNavBar>
      <div className="d-flex flex-grow-1">
        <SideNavBar>
          <UserTabs activeTab={activeTab} handleSelect={handleSelect} />
        </SideNavBar>
        <main className="flex-grow-1 p-3">{children}</main>
      </div>
    </Container>
  );
};

export { MainNav, SideNavBar, TopNavBar };
