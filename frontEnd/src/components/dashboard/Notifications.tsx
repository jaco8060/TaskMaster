import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, ListGroup, Spinner } from "react-bootstrap";

interface Notification {
  id: number;
  message: string;
  is_read: boolean;
  created_at: string;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="p-3" style={{ maxWidth: "400px" }}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h4>Notifications</h4>
      </div>
      <div className="mb-2">
        <Button variant="primary" size="sm" onClick={markAllAsRead}>
          Mark All as Read
        </Button>
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
              <div style={{ flex: 1 }}>{notif.message}</div>
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
    </div>
  );
};

export default Notifications;
