import * as CampaignsController from "../controllers/campaigns.controller";
import express from "express";
import { authenticateUserByAccessToken } from "../helpers/auth.helper";

const CampaignRouter = express.Router();

CampaignRouter.get(
  "/:id.:uid/org",
  authenticateUserByAccessToken,
  CampaignsController.getAllOrgCampaignsUser
);


export default CampaignRouter;
