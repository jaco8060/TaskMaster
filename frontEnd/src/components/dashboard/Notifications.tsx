import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, ListGroup, Modal, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface Notification {
  id: number;
  message: string;
  is_read: boolean;
  created_at: string;
  ticket_id?: number;
  ticket_title?: string;
  project_id?: number;
  project_name?: string;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_URL}/notifications`,
        { withCredentials: true }
      );
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
    setLoading(false);
  };

  const markAllAsRead = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_URL}/notifications/read/all`,
        {},
        { withCredentials: true }
      );
      fetchNotifications();
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const markAsRead = async (notificationId: number) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_URL}/notifications/${notificationId}/read`,
        {},
        { withCredentials: true }
      );
      fetchNotifications();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleClearConfirmation = async (confirm: boolean) => {
    setShowClearConfirmation(false);
    if (confirm) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_URL}/notifications/clear-all`,
          { withCredentials: true }
        );
        setNotifications([]);
      } catch (error) {
        console.error("Error clearing notifications:", error);
      }
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="p-3" style={{ maxWidth: "400px" }}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h4>Notifications</h4>
      </div>
      <div className="d-flex justify-content-between mb-2 gap-2">
        <div>
          <Button
            variant="primary"
            size="sm"
            onClick={markAllAsRead}
            className="me-2"
          >
            Mark All as Read
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setShowClearConfirmation(true)}
          >
            Clear All
          </Button>
        </div>
      </div>
      {loading ? (
        <Spinner animation="border" />
      ) : (
        <ListGroup>
          {notifications.map((notif) => (
            <ListGroup.Item
              key={notif.id}
              className={`d-flex justify-content-between align-items-center ${
                notif.is_read ? "text-muted" : ""
              }`}
            >
              <div style={{ flex: 1 }}>
                <div>{notif.message}</div>
                {(notif.ticket_id || notif.project_id) && (
                  <div className="mt-1">
                    <a
                      href={
                        notif.ticket_id
                          ? `/ticket-details/${notif.ticket_id}`
                          : `/project-details/${notif.project_id}`
                      }
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(
                          notif.ticket_id
                            ? `/ticket-details/${notif.ticket_id}`
                            : `/project-details/${notif.project_id}`
                        );
                      }}
                      style={{ textDecoration: "none" }}
                    >
                      {notif.ticket_id
                        ? `View Ticket: ${notif.ticket_title} (Project: ${notif.project_name})`
                        : `View Project: ${notif.project_name}`}
                    </a>
                  </div>
                )}
              </div>
              {!notif.is_read && (
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => markAsRead(notif.id)}
                >
                  Mark as Read
                </Button>
              )}
            </ListGroup.Item>
          ))}
          {notifications.length === 0 && (
            <ListGroup.Item>No notifications to show.</ListGroup.Item>
          )}
        </ListGroup>
      )}
      <Modal
        show={showClearConfirmation}
        onHide={() => setShowClearConfirmation(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Clear</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete all notifications?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => handleClearConfirmation(false)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => handleClearConfirmation(true)}
          >
            Clear All
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Notifications;
