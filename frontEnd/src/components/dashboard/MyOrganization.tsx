import axios from "axios";
import React, { useEffect, useState } from "react";
import { Alert, Button, Container, Spinner, Table } from "react-bootstrap";

const MyOrganization: React.FC = () => {
  const [organization, setOrganization] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Fetch organization data for the logged-in user.
  const fetchOrganization = async () => {
    try {
      // Assume your backend has an endpoint to get the organization info for the current user.
      const response = await axios.get(
        `${import.meta.env.VITE_URL}/organizations/my`,
        { withCredentials: true }
      );
      setOrganization(response.data.organization);
      setMembers(response.data.members);
    } catch (error) {
      console.error("Error fetching organization data", error);
      setMessage("Failed to load organization data");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrganization();
  }, []);

  if (loading) return <Spinner animation="border" />;

  return (
    <Container className="mt-4">
      <h2>My Organization</h2>
      {message && <Alert variant="danger">{message}</Alert>}
      {organization ? (
        <>
          <h4>{organization.name}</h4>
          <p>Organization Code: {organization.org_code}</p>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>User</th>
                <th>Status</th>
                {organization.isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id}>
                  <td>{member.username}</td>
                  <td>{member.status}</td>
                  {organization.isAdmin && (
                    <td>
                      <Button variant="danger" size="sm">
                        Remove
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      ) : (
        <p>You are not a member of any organization.</p>
      )}
    </Container>
  );
};

export default MyOrganization;
