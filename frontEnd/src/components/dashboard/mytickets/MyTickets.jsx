import axios from "axios";
import { format } from "date-fns";
import React, { useContext, useEffect, useState } from "react";
import { Button, Container, Spinner, Table } from "react-bootstrap";
import { AuthContext } from "../../../contexts/AuthProvider.jsx";
import { MainNav } from "../NavBars.jsx";

const MyTickets = () => {
  const { user } = useContext(AuthContext); // Get the current logged-in user
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_URL}/tickets/user/${user.id}`,
        {
          withCredentials: true,
        }
      );
      setTickets(response.data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      alert("Failed to fetch tickets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [user.id]);

  const formatDate = (dateString) => {
    return format(new Date(dateString), "MMMM d, yyyy h:mm a");
  };

  if (loading) {
    return (
      <MainNav>
        <Container
          className="d-flex justify-content-center align-items-center"
          style={{ height: "100vh" }}
        >
          <Spinner animation="border" />
        </Container>
      </MainNav>
    );
  }

  return (
    <MainNav>
      <Container>
        <h1 className="mb-3">My Tickets</h1>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Assigned At</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td>{ticket.title}</td>
                <td>{ticket.description}</td>
                <td>{ticket.status}</td>
                <td>{ticket.priority}</td>
                <td>{formatDate(ticket.assigned_at)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </MainNav>
  );
};

export default MyTickets;
