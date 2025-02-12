// frontEnd/src/components/dashboard/MyOrganization.tsx
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Alert, Button, Container, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import DataTable from "../../hooks/DataTable";
import { MainNav } from "./NavBars";

const MyOrganization: React.FC = () => {
  const [organization, setOrganization] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchOrganization();
  }, []);

  // Function to copy the invite code to clipboard
  const handleCopyCode = () => {
    if (organization && organization.org_code) {
      navigator.clipboard.writeText(organization.org_code);
      alert("Invite code copied to clipboard!");
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
            <p>
              <strong>Invite Code:</strong> {organization.org_code}
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
              ]}
              searchFields={["username", "email", "role"]}
            />
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
      </Container>
    </MainNav>
  );
};

export default MyOrganization;
