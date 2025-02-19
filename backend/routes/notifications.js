import express from "express";
import {
  handleClearAllNotifications,
  handleGetNotifications,
  handleMarkAllNotificationsAsRead,
  handleMarkNotificationAsRead,
} from "../controllers/notificationController.js";
import { ensureAuthenticated } from "../middleware/authMiddleware.js";

const notificationRouter = express.Router();

notificationRouter.get("/", ensureAuthenticated, handleGetNotifications);
notificationRouter.put(
  "/:id/read",
  ensureAuthenticated,
  handleMarkNotificationAsRead
);
notificationRouter.put(
  "/read/all",
  ensureAuthenticated,
  handleMarkAllNotificationsAsRead
);
notificationRouter.delete(
  "/clear-all",
  ensureAuthenticated,
  handleClearAllNotifications
);

export default notificationRouter;
