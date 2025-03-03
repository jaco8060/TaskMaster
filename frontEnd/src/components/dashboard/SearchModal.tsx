// frontEnd/src/components/dashboard/SearchModal.tsx
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Badge, Form, ListGroup, Modal } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../../styles/dashboard/NavBars.scss";

interface SearchResult {
  users: Array<{ id: number; username: string; email: string; link: string }>;
  tickets: Array<{
    id: number;
    title: string;
    description: string;
    link: string;
  }>;
  projects: Array<{
    id: number;
    name: string;
    description: string;
    link: string;
  }>;
}

const SearchModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult>({
    users: [],
    tickets: [],
    projects: [],
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim()) {
        handleSearch();
      } else {
        setResults({ users: [], tickets: [], projects: [] });
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_URL}/dashboard/search`,
        {
          params: { query },
          withCredentials: true,
        }
      );
      setResults(response.data);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (link: string) => {
    navigate(link);
    setShowModal(false);
  };

  const renderResults = (
    items: any[],
    type: string,
    keyField: string,
    displayField: string
  ) =>
    items.length > 0 && (
      <>
        <h6>
          {type}{" "}
          <Badge bg="secondary" text="primary">
            {items.length}
          </Badge>
        </h6>
        <ListGroup variant="flush">
          {items.map((item) => (
            <ListGroup.Item
              key={item[keyField]}
              action
              onClick={() => handleResultClick(item.link)}
              className="d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{item[displayField]}</strong>
                {item.description && (
                  <p className="mb-0 text-muted">
                    {item.description.slice(0, 100)}...
                  </p>
                )}
                {item.email && <p className="mb-0">{item.email}</p>}
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </>
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
        centered
        dialogClassName="search-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Search TaskMaster</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Search users, tickets, projects..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              disabled={loading}
            />
          </Form.Group>
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <div className="search-results">
              {renderResults(results.users, "Users", "id", "username")}
              {renderResults(results.tickets, "Tickets", "id", "title")}
              {renderResults(results.projects, "Projects", "id", "name")}
              {query.trim() &&
                !results.users.length &&
                !results.tickets.length &&
                !results.projects.length && <p>No results found.</p>}
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default SearchModal;
