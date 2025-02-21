// frontEnd/src/components/dashboard/MyOrganization.tsx
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Container,
  Modal,
  Spinner,
  Toast,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext, AuthContextType } from "../../contexts/AuthProvider";
import DataTable from "../../hooks/DataTable";
import { MainNav } from "./NavBars";
import { format } from "date-fns";

const MyOrganization: React.FC = () => {
  const [organization, setOrganization] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [showRequestToast, setShowRequestToast] = useState(false);
  const [requestToastMessage, setRequestToastMessage] = useState("");
  const [requestToastVariant, setRequestToastVariant] = useState<
    "success" | "danger"
  >("success");
  const { user } = useContext(AuthContext) as AuthContextType;
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const disabledUsernames = ["demo_admin", "demo_sub", "demo_dev", "demo_pm"];

  // Fetch organization data for the logged-in user.
  const fetchOrganization = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_URL}/organizations/my`,
        { withCredentials: true }
      );
      // response.data is expected to have { organization, members }
      setOrganization(response.data.organization);
      setMembers(response.data.members);
    } catch (error) {
      console.error("Error fetching organization data", error);
      setMessage("Failed to load organization data");
    } finally {
      setLoading(false);
    }
  };

  // Add this before the useEffect that calls it
  const fetchPendingRequests = async () => {
    if (organization && user?.role === "admin") {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_URL}/organizations/${
            organization.id
          }/pending-requests`,
          { withCredentials: true }
        );
        setPendingRequests(response.data);
      } catch (error) {
        console.error("Error fetching pending requests:", error);
      }
    }
  };

  useEffect(() => {
    fetchOrganization();
  }, []);

  useEffect(() => {
    fetchPendingRequests();
  }, [organization, user?.role]);

  // Function to copy the invite code to clipboard
  const handleCopyCode = () => {
    if (organization && organization.org_code) {
      navigator.clipboard.writeText(organization.org_code);
      setShowToast(true);
    }
  };

  const handleProcessRequest = async (
    userId: string,
    action: "approve" | "reject"
  ) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_URL}/organizations/process-request`,
        {
          user_id: userId,
          organization_id: organization?.id,
          status: action === "approve" ? "approved" : "rejected",
        },
        { withCredentials: true }
      );

      // Refresh both organization data and pending requests
      await fetchOrganization();
      await fetchPendingRequests();

      setRequestToastVariant("success");
      setRequestToastMessage(`Request ${action}d successfully`);
      setShowRequestToast(true);
    } catch (error) {
      console.error("Error processing request:", error);
      setRequestToastVariant("danger");
      setRequestToastMessage("Failed to process request");
      setShowRequestToast(true);
    }
  };

  const handleRemoveMember = async () => {
    if (!selectedMember || !organization) return;

    try {
      // Check against local member data instead of API call
      if (disabledUsernames.includes(selectedMember.username)) {
        setRequestToastVariant("danger");
        setRequestToastMessage("Cannot remove demo/test accounts");
        setShowRequestToast(true);
        return;
      }

      await axios.delete(
        `${import.meta.env.VITE_URL}/organizations/${organization.id}/members/${
          selectedMember.id
        }`,
        { withCredentials: true }
      );

      await fetchOrganization(); // Refresh the list
      setShowRemoveModal(false);
      setRequestToastVariant("success");
      setRequestToastMessage("Member removed successfully");
      setShowRequestToast(true);
    } catch (error) {
      console.error("Error removing member:", error);
      setRequestToastVariant("danger");
      setRequestToastMessage("Failed to remove member");
      setShowRequestToast(true);
    }
  };

  if (loading) {
    return (
      <MainNav>
        <Container
          className="d-flex justify-content-center align-items-center"
          style={{ height: "100vh" }}
        >
          <Spinner animation="border" variant="primary" />
        </Container>
      </MainNav>
    );
  }

  return (
    <MainNav>
      <Container className="section-container">
        <h2>My Organization</h2>
        {message && <Alert variant="danger">{message}</Alert>}
        {organization ? (
          <>
            <h4>{organization.name}</h4>
            <p className="fs-5">
              <strong>Invite Code:</strong> <Badge bg="success" className="fs-5">{organization.org_code}</Badge>
            </p>
            <Button variant="outline-primary" onClick={handleCopyCode}>
              Copy Invite Code
            </Button>
            {/* Optionally add a "Send Invite" button here */}
            <hr />
            <h5>Members</h5>
            <DataTable
              staticData={members}
              columns={[
                { header: "Username", accessor: "username" },
                { header: "Email", accessor: "email" },
                { header: "Role", accessor: "role" },
                { header: "", accessor: "actions", sortable: false },
              ]}
              searchFields={["username", "email", "role"]}
              renderCell={(item: any, accessor: string) => {
                if (accessor === "actions" && user?.role === "admin") {
                  const isDisabled = disabledUsernames.includes(item.username);
                  return (
                    <div className="d-flex justify-content-end">
                      {!isDisabled && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => {
                            setSelectedMember(item);
                            setShowRemoveModal(true);
                          }}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  );
                }
                return item[accessor];
              }}
            />
            {user?.role === "admin" && pendingRequests.length > 0 && (
              <>
                <hr />
                <h5>Pending Join Requests</h5>
                <DataTable
                  staticData={pendingRequests}
                  columns={[
                    { header: "Username", accessor: "username" },
                    { header: "Email", accessor: "email" },
                    { 
                      header: "Requested At", 
                      accessor: "requested_at",
                      type: "date"
                    },
                    { header: "", accessor: "actions", sortable: false },
                  ]}
                  searchFields={["username", "email"]}
                  renderCell={(item: any, accessor: string) => {
                    if (accessor === "actions") {
                      return (
                        <div className="d-flex gap-2 justify-content-end">
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() =>
                              handleProcessRequest(item.user_id, "approve")
                            }
                          >
                            Approve
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() =>
                              handleProcessRequest(item.user_id, "reject")
                            }
                          >
                            Reject
                          </Button>
                        </div>
                      );
                    }
                    if (accessor === "requested_at") {
                      return format(new Date(item[accessor]), "MMMM d, yyyy h:mm a");
                    }
                    return item[accessor];
                  }}
                />
              </>
            )}
          </>
        ) : (
          <>
            <Alert variant="warning">
              You are not a member of any organization.
            </Alert>
            <Button variant="primary" onClick={() => navigate("/register")}>
              Create an Organization
            </Button>
          </>
        )}
        {showToast && (
          <Toast
            onClose={() => setShowToast(false)}
            show={showToast}
            delay={3000}
            autohide
            bg="success"
            className="position-fixed start-50 translate-middle-x"
            style={{ top: "70px" }}
          >
            <Toast.Header>
              <strong className="me-auto">Success</strong>
            </Toast.Header>
            <Toast.Body className="text-white">
              Invite code copied to clipboard!
            </Toast.Body>
          </Toast>
        )}
        <Toast
          onClose={() => setShowRequestToast(false)}
          show={showRequestToast}
          delay={3000}
          autohide
          bg={requestToastVariant}
          className="position-fixed start-50 translate-middle-x"
          style={{ top: "100px" }}
        >
          <Toast.Header>
            <strong className="me-auto">
              {requestToastVariant === "success" ? "Success" : "Error"}
            </strong>
          </Toast.Header>
          <Toast.Body className="text-white">{requestToastMessage}</Toast.Body>
        </Toast>
        <Modal show={showRemoveModal} onHide={() => setShowRemoveModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Removal</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to remove{" "}
            <strong>{selectedMember?.username}</strong> from the organization?
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowRemoveModal(false)}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleRemoveMember}>
              Remove Member
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </MainNav>
  );
};

export default MyOrganization;
