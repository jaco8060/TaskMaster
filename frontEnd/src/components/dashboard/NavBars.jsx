import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import { FaBell, FaCog, FaSignOutAlt, FaTicketAlt } from "react-icons/fa";
import "../../styles/NavBars.scss"; // Import the SCSS file
import UserTabs from "./UserTabs";

const TopNavBar = ({ children }) => {
  return (
    <Navbar expand="lg" className="bg-body-tertiary border-bottom" sticky="top">
      <Container fluid>
        <div className="d-flex align-items-center gap-3">
          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${"lg"}`} />
          <Navbar.Brand href="#">Bug Tracker</Navbar.Brand>
        </div>

        <Navbar.Offcanvas
          id={`offcanvasNavbar-expand-${"lg"}`}
          aria-labelledby={`offcanvasNavbarLabel-expand-${"lg"}`}
          placement="start"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title
              id={`offcanvasNavbarLabel-expand-${"lg"}`}
              className="d-flex align-items-center"
            >
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
            {/* show tabs of current children */}

            <hr />
            <div className="d-flex d-lg-none justify-content-center">
              <div className="d-inline-flex bg-body-tertiary rounded py-2 px-3 d-lg-none justify-content-center gap-4">
                <Nav.Link href="#notifications" className="mb-0">
                  <FaBell size={30} />
                </Nav.Link>
                <Nav.Link href="#settings" className="mb-0">
                  <FaCog size={30} />
                </Nav.Link>
                <Nav.Link href="#logout" className="mb-0">
                  <FaSignOutAlt size={30} />
                </Nav.Link>
              </div>
            </div>

            {/* non mobile styles */}
            <Nav className="justify-content-end flex-grow-1 pe-3 offcanvas-nav">
              <Button
                variant="primary"
                className="me-2 d-none d-lg-inline text-nowrap"
              >
                New Ticket
              </Button>
              <Nav.Link href="#notifications" className=" d-none d-lg-inline">
                <div className="d-flex align-items-center">
                  <h6 className="mb-0 me-2">Notifications</h6>
                  <FaBell size={25} />
                </div>
              </Nav.Link>
              <Nav.Link href="#settings" className=" d-none d-lg-inline">
                <div className="d-flex align-items-center">
                  <h6 className="mb-0 me-2">Settings</h6>
                  <FaCog size={25} />
                </div>
              </Nav.Link>
              <Nav.Link className="d-none d-lg-inline">
                <div className="d-flex align-items-center">
                  <h className="mb-0 me-2">Logout</h>
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
  return (
    <>
      <Container
        fluid
        className="p-0 d-flex flex-column"
        style={{ height: "100vh" }}
      >
        <TopNavBar>
          <UserTabs />
        </TopNavBar>
        <div className="d-flex flex-grow-1">
          <SideNavBar>
            <UserTabs />
          </SideNavBar>
          <main className="flex-grow-1 p-3">{children}</main>
        </div>
      </Container>
    </>
  );
};

export { MainNav, SideNavBar, TopNavBar };
