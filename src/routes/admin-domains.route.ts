import * as DomainsController from "../controllers/domains.controller";
import express from "express";
import { authenticateUserByAccessToken } from "../helpers/auth.helper";

const AdminDomainsRouter = express.Router();

AdminDomainsRouter.get(
  "/",
  authenticateUserByAccessToken,
  DomainsController.getAllDomains
);

AdminDomainsRouter.post(
  "/",
  authenticateUserByAccessToken,
  DomainsController.createDomain
);

AdminDomainsRouter.get(
  "/:id",
  authenticateUserByAccessToken,
  DomainsController.getDomain
);

AdminDomainsRouter.put(
  "/:id",
  authenticateUserByAccessToken,
  DomainsController.updateDomain
);

AdminDomainsRouter.delete(
  "/:id",
  authenticateUserByAccessToken,
  DomainsController.deleteDomain
);

export default AdminDomainsRouter;
