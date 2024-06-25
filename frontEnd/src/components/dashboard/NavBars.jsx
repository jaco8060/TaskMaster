import React, { useContext, useEffect, useState } from "react";

import axios from "axios";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import { FaBell, FaCog, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import BugTrackerIcon from "../../assets/bug-tracker-icon.svg";
import { AuthContext } from "../../contexts/AuthProvider.jsx";
import "../../styles/NavBars.scss"; // Import the SCSS file
import UserTabs from "./UserTabs";

const TopNavBar = ({ children }) => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_URL}/auth/logout`,
        {
          withCredentials: true,
        }
      );

      // Clear user context
      setUser(null);

      // Clear active tab from local storage
      localStorage.removeItem("activeTab");

      // Navigate to login
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      alert("Logout failed");
    }
  };

  return (
    <Navbar
      expand="lg"
      className="bg-secondary border-bottom border-primary-subtle"
      sticky="top"
    >
      <Container fluid>
        <div className="d-flex align-items-center gap-3">
          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-lg`} />
          <Navbar.Brand href="#">
            <img
              src={BugTrackerIcon}
              alt="Bug Tracker Icon"
              width="30"
              height="30"
              className="d-inline-block align-top me-2"
            />
            Bug Tracker
          </Navbar.Brand>
        </div>

        <Navbar.Offcanvas
          id={`offcanvasNavbar-expand-lg`}
          aria-labelledby={`offcanvasNavbarLabel-expand-lg`}
          placement="start"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title
              id={`offcanvasNavbarLabel-expand-lg`}
              className="d-flex align-items-center"
            >
              <img
                src={BugTrackerIcon}
                alt="Bug Tracker Icon"
                width="30"
                height="30"
                className="d-inline-block align-top me-2"
              />
              Bug Tracker
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
              <Button
                variant="primary"
                className="d-lg-none d-lg-inline text-nowrap mx-auto mb-2"
                style={{ width: "150px" }}
              >
                New Ticket
              </Button>
              <hr />
              <div id="TopNavBarMobile">{children}</div>
            </div>
            <hr />
            <div className="d-flex d-lg-none justify-content-center">
              <div className="d-inline-flex bg-body-tertiary rounded py-2 px-3 d-lg-none justify-content-center gap-4">
                <Nav.Link href="#notifications" className="mb-0">
                  <FaBell size={30} />
                </Nav.Link>
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
            <Nav className="justify-content-end flex-grow-1 pe-3 offcanvas-nav">
              <Button
                variant="primary"
                className="me-2 d-none d-lg-inline text-nowrap"
              >
                New Ticket
              </Button>
              <Nav.Link href="#notifications" className="d-none d-lg-inline">
                <div className="d-flex align-items-center">
                  <h6 className="mb-0 me-2">Notifications</h6>
                  <FaBell size={25} />
                </div>
              </Nav.Link>
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
  );
};

const SideNavBar = ({ children }) => {
  return (
    <>
      <aside
        // id refers to styles/NavBars.scss styling
        id="SideNavBar"
      >
        {children}
      </aside>
    </>
  );
};
const MainNav = ({ children }) => {
  const [activeTab, setActiveTab] = useState("first");

  const handleSelect = (eventKey) => {
    setActiveTab(eventKey);
  };

  return (
    <>
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
    </>
  );
};

export { MainNav, SideNavBar, TopNavBar };
