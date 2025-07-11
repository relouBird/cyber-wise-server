import * as CampaignsController from "../controllers/campaigns.controller";
import express from "express";
import { authenticateUserByAccessToken } from "../helpers/auth.helper";
import multer from "multer";

const AdminCampaignsRouter = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

AdminCampaignsRouter.get(
  "/",
  authenticateUserByAccessToken,
  CampaignsController.getAllCampaigns
);

AdminCampaignsRouter.get(
  "/:id/org",
  authenticateUserByAccessToken,
  CampaignsController.getAllOrgCampaigns
);

AdminCampaignsRouter.get(
  "/:id/users",
  authenticateUserByAccessToken,
  CampaignsController.getAllCampaignsUsers
);

AdminCampaignsRouter.post(
  "/",
  authenticateUserByAccessToken,
  upload.single("image"),
  CampaignsController.createCampaign
);

AdminCampaignsRouter.put(
  "/:id",
  authenticateUserByAccessToken,
  upload.single("image"),
  CampaignsController.updateCampaign
);

AdminCampaignsRouter.delete(
  "/:id",
  authenticateUserByAccessToken,
  CampaignsController.deleteCampaign
);

export default AdminCampaignsRouter;
