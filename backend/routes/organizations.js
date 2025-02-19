// backend/routes/organizations.js
import express from "express";
import {
  handleCreateOrganization,
  handleGetMyOrganization,
  handleGetPendingRequests,
  handleJoinOrganizationWithCode,
  handleProcessJoinRequest,
  handleRequestJoinOrganization,
  handleSearchOrganizations,
} from "../controllers/organizationController.js";
import { ensureAuthenticated } from "../middleware/authMiddleware.js";

const organizationRouter = express.Router();

organizationRouter.post(
  "/create",
  ensureAuthenticated,
  handleCreateOrganization
);
organizationRouter.post(
  "/join-code",
  ensureAuthenticated,
  handleJoinOrganizationWithCode
);
organizationRouter.get("/search", handleSearchOrganizations);
organizationRouter.post(
  "/request-join",
  ensureAuthenticated,
  handleRequestJoinOrganization
);

organizationRouter.get("/my", ensureAuthenticated, handleGetMyOrganization);

organizationRouter.get(
  "/:id/pending-requests",
  ensureAuthenticated,
  handleGetPendingRequests
);

organizationRouter.post(
  "/process-request",
  ensureAuthenticated,
  handleProcessJoinRequest
);

export default organizationRouter;
