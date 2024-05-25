import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import { FaBell, FaCog, FaSignOutAlt, FaTicketAlt } from "react-icons/fa";
import "../styles/TopNavBar.scss"; // Import the SCSS file

const TopNavBar = () => {
  return (
    <Navbar expand="md" className="bg-body-tertiary mb-3" sticky="top">
      <Container fluid>
        <div className="d-flex align-items-center gap-3">
          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${"md"}`} />
          <Navbar.Brand href="#">Bug Tracker</Navbar.Brand>
        </div>

        <Navbar.Offcanvas
          id={`offcanvasNavbar-expand-${"md"}`}
          aria-labelledby={`offcanvasNavbarLabel-expand-${"md"}`}
          placement="start"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title
              id={`offcanvasNavbarLabel-expand-${"md"}`}
              className="d-flex align-items-center"
            >
              Bug Tracker
            </Offcanvas.Title>
          </Offcanvas.Header>

          <Offcanvas.Body>
            <Form
              className="d-flex me-auto my-2 my-md-0"
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
            <div className="d-flex d-md-none justify-content-center">
              <Button
                variant="primary"
                className="d-md-none d-md-inline text-nowrap"
              >
                New Ticket
              </Button>
            </div>
            <div className="d-flex d-md-none justify-content-center">
              <div className="d-inline-flex bg-body-tertiary rounded py-2 px-3 d-md-none justify-content-center gap-4 mx-auto">
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
                className="me-2 mb-2 d-none d-md-inline"
              >
                New Ticket
              </Button>
              <Nav.Link
                href="#notifications"
                className="mb-2 d-none d-md-inline"
              >
                <FaBell size={25} />
              </Nav.Link>
              <Nav.Link href="#settings" className="mb-2 d-none d-md-inline">
                <FaCog size={25} />
              </Nav.Link>
              <Nav.Link href="#logout" className="mb-2 d-none d-md-inline">
                <FaSignOutAlt size={25} />
              </Nav.Link>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};
const SideNavBar = () => {
  return h12;
};

export { TopNavBar };
