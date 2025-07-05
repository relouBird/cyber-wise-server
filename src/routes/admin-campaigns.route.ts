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
  "/:id",
  authenticateUserByAccessToken,
  CampaignsController.getAllOrgCampaigns
);

AdminCampaignsRouter.post(
  "/",
  authenticateUserByAccessToken,
  upload.single("image"),
  CampaignsController.createCampaign
);

AdminCampaignsRouter.put(
  "/training",
  authenticateUserByAccessToken,
  upload.single("image"),
  CampaignsController.updateCampaign
);

export default AdminCampaignsRouter;
