import {
  deleteAllNotificationsForUser,
  getNotificationsForUser,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../models/notificationModel.js";

export const handleGetNotifications = async (req, res) => {
  const userId = req.user.id;
  const { onlyUnread } = req.query;
  try {
    const notifications = await getNotificationsForUser(
      userId,
      onlyUnread === "true"
    );
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

export const handleMarkNotificationAsRead = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const updated = await markNotificationAsRead(Number(id), userId);
    if (!updated) {
      return res.status(404).json({ error: "Notification not found" });
    }
    res.status(200).json(updated);
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ error: "Failed to mark notification as read" });
  }
};

export const handleMarkAllNotificationsAsRead = async (req, res) => {
  const userId = req.user.id;
  try {
    await markAllNotificationsAsRead(userId);
    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({ error: "Failed to mark notifications as read" });
  }
};

export const handleClearAllNotifications = async (req, res) => {
  const userId = req.user.id;
  try {
    await deleteAllNotificationsForUser(userId);
    res.status(200).json({ message: "All notifications cleared" });
  } catch (error) {
    console.error("Error clearing notifications:", error);
    res.status(500).json({ error: "Failed to clear notifications" });
  }
};
