import { useMemo, useState } from "react";
import { Button, Form, InputGroup, ListGroup, Modal } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SearchModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Keyword groups defined inside the component
  const keywordGroups = useMemo(
    () => [
      {
        component: "Dashboard",
        route: "/dashboard",
        keywords: [
          "overview",
          "statistics",
          "activity feed",
          "quick actions",
          "recent updates",
        ],
      },
      {
        component: "MyProjects",
        route: "/myprojects",
        keywords: [
          "projects",
          "create project",
          "project details",
          "assign personnel",
          "project status",
        ],
      },
      {
        component: "ProjectDetails",
        route: "/project-details/:id",
        keywords: [
          "project timeline",
          "personnel management",
          "tickets",
          "description",
          "active status",
        ],
      },
      {
        component: "MyTickets",
        route: "/mytickets",
        keywords: [
          "tickets",
          "bug reports",
          "feature requests",
          "priority",
          "status",
          "assignee",
        ],
      },
      {
        component: "TicketDetails",
        route: "/ticket-details/:id",
        keywords: [
          "comments",
          "attachments",
          "history",
          "priority",
          "status update",
          "description",
        ],
      },
      {
        component: "ManageRoles",
        route: "/manage-roles",
        keywords: [
          "user roles",
          "permissions",
          "role assignment",
          "admin controls",
          "access levels",
        ],
      },
      {
        component: "UserProfile",
        route: "/userprofile",
        keywords: [
          "profile settings",
          "avatar",
          "password change",
          "email",
          "notification preferences",
        ],
      },
      {
        component: "MyOrganization",
        route: "/myorganization",
        keywords: [
          "team management",
          "organization settings",
          "members",
          "invitations",
          "billing",
        ],
      },
    ],
    []
  );

  const filteredGroups = useMemo(
    () =>
      keywordGroups
        .map((group) => ({
          ...group,
          keywords: group.keywords.filter((keyword) =>
            keyword.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        }))
        .filter((group) => group.keywords.length > 0),
    [searchQuery, keywordGroups]
  );

  return (
    <>
      <div
        className="search-input-button"
        onClick={() => setShowModal(true)}
        role="button"
      >
        <div className="d-flex align-items-center">
          <FaSearch className="me-2" />
          <span>Search</span>
        </div>
      </div>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        className="search-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Quick Search</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3 ">
            <Form.Control
              placeholder="Search features"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </InputGroup>

          <div className="search-results">
            {filteredGroups.map((group) => (
              <div key={group.component} className="mb-4">
                <h6 className="mb-2">{group.component}</h6>
                <ListGroup variant="flush">
                  {group.keywords.map((keyword) => (
                    <ListGroup.Item
                      key={keyword}
                      action
                      onClick={() => {
                        navigate(group.route);
                        setShowModal(false);
                      }}
                    >
                      {keyword}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
            ))}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default SearchModal;
