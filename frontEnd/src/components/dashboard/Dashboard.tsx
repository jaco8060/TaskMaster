// frontEnd/src/components/dashboard/Dashboard.tsx
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Card, Col, Container, Row, Spinner } from "react-bootstrap";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AuthContext, AuthContextType } from "../../contexts/AuthProvider";
import { MainNav } from "./NavBars";

interface UserMetrics {
  activeProjects: number;
  totalTickets: number;
  unassignedTickets: number;
  notifications: number;
}

interface AdminMetrics {
  newUsers: number;
  totalUsers: number;
  ticketsInDevelopment: number;
  totalDevelopers: number;
}

interface PriorityData {
  name: string;
  value: number;
}

interface UserTypeData {
  type: string;
  count: number;
}

interface TicketDistributionData {
  project: string;
  tickets: number;
}

const Dashboard: React.FC = () => {
  const { user } = useContext(AuthContext) as AuthContextType;
  const [loading, setLoading] = useState<boolean>(true);
  const [userMetrics, setUserMetrics] = useState<UserMetrics | null>(null);
  const [adminMetrics, setAdminMetrics] = useState<AdminMetrics | null>(null);
  const [priorityData, setPriorityData] = useState<PriorityData[]>([]);
  const [userTypeData, setUserTypeData] = useState<UserTypeData[]>([]);
  const [ticketDistribution, setTicketDistribution] = useState<
    TicketDistributionData[]
  >([]);

  // If no user is present, show a loading spinner
  if (!user) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch user metrics
        const userMetricsRes = await axios.get(
          `${import.meta.env.VITE_URL}/dashboard/user-metrics?userId=${
            user.id
          }`,
          { withCredentials: true }
        );
        setUserMetrics(userMetricsRes.data);

        // If user is admin, fetch admin metrics
        if (user.role === "admin") {
          const adminMetricsRes = await axios.get(
            `${import.meta.env.VITE_URL}/dashboard/admin-metrics`,
            { withCredentials: true }
          );
          setAdminMetrics(adminMetricsRes.data);
        }

        // Fetch priority projects data
        const priorityRes = await axios.get(
          `${import.meta.env.VITE_URL}/dashboard/priority-projects`,
          { withCredentials: true }
        );
        const prioData = priorityRes.data;
        setPriorityData(
          Array.isArray(prioData)
            ? prioData
            : [
                { name: "Low", value: 40 },
                { name: "Medium", value: 35 },
                { name: "High", value: 25 },
              ]
        );

        // Fetch user types breakdown data
        const userTypeRes = await axios.get(
          `${import.meta.env.VITE_URL}/dashboard/user-types`,
          { withCredentials: true }
        );
        const utData = userTypeRes.data;
        setUserTypeData(
          Array.isArray(utData)
            ? utData
            : [
                { type: "Submitter", count: 40 },
                { type: "Developer", count: 30 },
                { type: "PM", count: 20 },
                { type: "Admin", count: 10 },
              ]
        );

        // Fetch ticket distribution data
        const ticketDistRes = await axios.get(
          `${import.meta.env.VITE_URL}/dashboard/ticket-distribution`,
          { withCredentials: true }
        );
        const tdData = ticketDistRes.data;
        setTicketDistribution(
          Array.isArray(tdData)
            ? tdData
            : [
                { project: "Project A", tickets: 20 },
                { project: "Project B", tickets: 15 },
                { project: "Project C", tickets: 10 },
                { project: "Project D", tickets: 3 },
                { project: "Project E", tickets: 2 },
                { project: "Other", tickets: 0 },
              ]
        );
      } catch (error) {
        console.error("Dashboard fetch error:", error);
        // Fallback dummy data in case of error
        setUserMetrics({
          activeProjects: 5,
          totalTickets: 50,
          unassignedTickets: 10,
          notifications: 3,
        });
        if (user.role === "admin") {
          setAdminMetrics({
            newUsers: 2,
            totalUsers: 100,
            ticketsInDevelopment: 15,
            totalDevelopers: 30,
          });
        }
        setPriorityData([
          { name: "Low", value: 40 },
          { name: "Medium", value: 35 },
          { name: "High", value: 25 },
        ]);
        setUserTypeData([
          { type: "Submitter", count: 40 },
          { type: "Developer", count: 30 },
          { type: "PM", count: 20 },
          { type: "Admin", count: 10 },
        ]);
        setTicketDistribution([
          { project: "Project A", tickets: 20 },
          { project: "Project B", tickets: 15 },
          { project: "Project C", tickets: 10 },
          { project: "Project D", tickets: 3 },
          { project: "Project E", tickets: 2 },
          { project: "Other", tickets: 0 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const pieColors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  if (loading)
    return (
      <>
        <MainNav>
          <Container
            className="d-flex justify-content-center align-items-center"
            style={{ height: "100vh" }}
          >
            <Spinner animation="border" variant="primary" />
          </Container>
        </MainNav>
      </>
    );

  return (
    <MainNav>
      <Container className="">
        <Row>
          <Col>
            <h2>Dashboard</h2>
            {user.organization_name && (
              <h6 className="text-muted">
                Organization: {user.organization_name}
              </h6>
            )}
          </Col>
          {/* User Metrics Cards */}
          {userMetrics && (
            <Row className="mb-4">
              <Col md={3}>
                <Card>
                  <Card.Body>
                    <Card.Title>Active Projects</Card.Title>
                    <Card.Text>{userMetrics.activeProjects}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card>
                  <Card.Body>
                    <Card.Title>Total Tickets</Card.Title>
                    <Card.Text>{userMetrics.totalTickets}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card>
                  <Card.Body>
                    <Card.Title>Unassigned Tickets</Card.Title>
                    <Card.Text>{userMetrics.unassignedTickets}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card>
                  <Card.Body>
                    <Card.Title>Notifications</Card.Title>
                    <Card.Text>{userMetrics.notifications}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {/* Admin Metrics Cards (visible only to admin) */}
          {user.role === "admin" && adminMetrics && (
            <Row className="mb-4">
              <Col md={3}>
                <Card>
                  <Card.Body>
                    <Card.Title>New Users</Card.Title>
                    <Card.Text>{adminMetrics.newUsers}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card>
                  <Card.Body>
                    <Card.Title>Total Users</Card.Title>
                    <Card.Text>{adminMetrics.totalUsers}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card>
                  <Card.Body>
                    <Card.Title>Tickets in Development</Card.Title>
                    <Card.Text>{adminMetrics.ticketsInDevelopment}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card>
                  <Card.Body>
                    <Card.Title>Total Developers</Card.Title>
                    <Card.Text>{adminMetrics.totalDevelopers}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {/* Priority Projects Pie Chart */}
          <Row className="mb-4">
            <Col md={6}>
              <Card>
                <Card.Body>
                  <Card.Title>Ticket Priority Distribution</Card.Title>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={priorityData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        label
                      >
                        {priorityData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={pieColors[index % pieColors.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </Card.Body>
              </Card>
            </Col>

            {/* Active Ticket Distribution Pie Chart */}
            <Col md={6}>
              <Card>
                <Card.Body>
                  <Card.Title>Active Ticket Distribution</Card.Title>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={ticketDistribution}
                        dataKey="tickets"
                        nameKey="project"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#82ca9d"
                        label
                      >
                        {ticketDistribution.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={pieColors[index % pieColors.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* User Types Bar Chart */}
          <Row className="mb-4">
            <Col>
              <Card>
                <Card.Body>
                  <Card.Title>User Types Distribution</Card.Title>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={userTypeData}>
                      <XAxis dataKey="type" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Row>
      </Container>
    </MainNav>
  );
};

export default Dashboard;
