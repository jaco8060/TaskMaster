import express from "express";
import {
  handleCreateOrganization,
  handleJoinOrganizationWithCode,
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
organizationRouter.get(
  "/search",
  ensureAuthenticated,
  handleSearchOrganizations
);
organizationRouter.post(
  "/request-join",
  ensureAuthenticated,
  handleRequestJoinOrganization
);

export default organizationRouter;
