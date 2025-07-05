import * as ActivityController from "../controllers/activity.controller";
import express from "express";
import { authenticateUserByAccessToken } from "../helpers/auth.helper";
import multer from "multer";

const AdminActivityRouter = express.Router();

AdminActivityRouter.get(
  "/",
  authenticateUserByAccessToken,
  ActivityController.getAllActivities
);

AdminActivityRouter.get(
  "/:id",
  authenticateUserByAccessToken,
  ActivityController.getAllOrgActivities
);

AdminActivityRouter.post(
  "/user",
  authenticateUserByAccessToken,
  ActivityController.createUserActivity
);

AdminActivityRouter.post(
  "/training",
  authenticateUserByAccessToken,
  ActivityController.createUserActivity
);

export default AdminActivityRouter;
