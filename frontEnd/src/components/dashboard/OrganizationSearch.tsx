import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Spinner,
  Toast,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import "../../styles/login/RegisterWithOrganization.scss";

interface OrganizationSearchProps {
  onJoinSuccess: () => void;
}

const OrganizationSearch: React.FC<OrganizationSearchProps> = ({
  onJoinSuccess,
}) => {
  const navigate = useNavigate();
  const [joinMethod, setJoinMethod] = useState<"code" | "search" | null>(null);
  const [orgJoinInfo, setOrgJoinInfo] = useState({
    organization_id: "",
    org_code: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<number | null>(null);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    variant: "success" | "danger";
  }>({
    show: false,
    message: "",
    variant: "success",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const searchOrganizations = async () => {
    setLoadingSearch(true);
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_URL
        }/organizations/search?searchTerm=${encodeURIComponent(searchTerm)}`,
        { withCredentials: true }
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error searching organizations:", error);
      setToast({
        show: true,
        message: "Error searching organizations",
        variant: "danger",
      });
    } finally {
      setLoadingSearch(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim() !== "" && joinMethod === "search") {
        searchOrganizations();
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, joinMethod]);

  const handleJoinWithCode = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_URL}/organizations/join-with-code`,
        { org_code: orgJoinInfo.org_code },
        { withCredentials: true }
      );

      if (response.data.organization_id) {
        onJoinSuccess();
      }
    } catch (error) {
      setToast({
        show: true,
        message: axios.isAxiosError(error)
          ? error.response?.data?.error || "Failed to join organization"
          : "Failed to join organization",
        variant: "danger",
      });
    }
  };

  const handleRequestJoin = async (organizationId: number) => {
    if (!selectedOrg || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_URL}/organizations/request-join`,
        { organization_id: organizationId },
        { withCredentials: true }
      );

      setToast({
        show: true,
        message: "Join request submitted successfully",
        variant: "success",
      });
      
      setSearchResults(results => 
        results.map(org => 
          org.id === organizationId ? {...org, hasPendingRequest: true} : org
        )
      );
      setSelectedOrg(null);

    } catch (error) {
      setToast({
        show: true,
        message: axios.isAxiosError(error) 
          ? error.response?.data?.error || "Error submitting join request"
          : "Error submitting join request",
        variant: "danger",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="mt-5">
      <CSSTransition
        in={!joinMethod}
        timeout={300}
        classNames="fade"
        unmountOnExit
      >
        <div className="step-content">
          <h3>Join Organization</h3>
          <div className="d-flex flex-column gap-2">
            <Button variant="primary" onClick={() => setJoinMethod("code")}>
              Join with Invite Code
            </Button>
            <Button variant="secondary" onClick={() => setJoinMethod("search")}>
              Search Organizations
            </Button>
          </div>
        </div>
      </CSSTransition>

      <CSSTransition
        in={joinMethod === "code"}
        timeout={300}
        classNames="fade"
        unmountOnExit
      >
        <div className="step-content">
          <h3>Join with Invite Code</h3>
          <Form onSubmit={handleJoinWithCode}>
            <Form.Group className="mb-3">
              <Form.Label>Organization Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter organization code"
                value={orgJoinInfo.org_code}
                onChange={(e) =>
                  setOrgJoinInfo({ ...orgJoinInfo, org_code: e.target.value })
                }
              />
            </Form.Group>
            <div className="d-flex justify-content-between">
              <Button variant="secondary" onClick={() => setJoinMethod(null)}>
                Back
              </Button>
              <Button variant="primary" type="submit">
                Join Organization
              </Button>
            </div>
          </Form>
        </div>
      </CSSTransition>

      <CSSTransition
        in={joinMethod === "search"}
        timeout={300}
        classNames="fade"
        unmountOnExit
      >
        <div className="step-content">
          <h3>Search Organizations</h3>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Start typing to search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form.Group>

          {loadingSearch ? (
            <div className="text-center">
              <Spinner animation="border" />
            </div>
          ) : (
            <div className="organization-list">
              {searchResults.map((org) => (
                <Card
                  key={org.id}
                  className={`mb-3 ${
                    selectedOrg === org.id ? "border-primary bg-light" : ""
                  }`}
                  onClick={() => setSelectedOrg(org.id)}
                >
                  <Card.Body className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5>{org.name}</h5>
                      <small className="text-muted">
                        {org.member_count} members
                      </small>
                    </div>
                    {selectedOrg === org.id && (
                      <span className="badge bg-success">
                        {org.hasPendingRequest ? "Pending Approval" : "Selected"}
                      </span>
                    )}
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}

          <div className="d-flex justify-content-between mt-4">
            <Button variant="secondary" onClick={() => setJoinMethod(null)}>
              Back
            </Button>
            <Button
              variant="primary"
              onClick={() => selectedOrg && handleRequestJoin(selectedOrg)}
              disabled={!selectedOrg || isSubmitting}
            >
              {isSubmitting ? <Spinner size="sm" /> : "Request to Join"}
            </Button>
          </div>
        </div>
      </CSSTransition>

      <Toast
        onClose={() => setToast({ ...toast, show: false })}
        show={toast.show}
        delay={3000}
        autohide
        bg={toast.variant}
        className="position-fixed top-0 start-50 translate-middle-x mt-3"
      >
        <Toast.Body className="text-white">{toast.message}</Toast.Body>
      </Toast>
    </Container>
  );
};

export default OrganizationSearch;
