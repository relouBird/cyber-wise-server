import * as TrainingController from "../controllers/trainings.controller";
import express from "express";
import { authenticateUserByAccessToken } from "../helpers/auth.helper";
import multer from "multer";

const TrainingRouter = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

TrainingRouter.get(
  "/",
  authenticateUserByAccessToken,
  TrainingController.getAllTrainings
);

TrainingRouter.post(
  "/:id",
  authenticateUserByAccessToken,
  TrainingController.subscribeToTrainings
);

TrainingRouter.get(
  "/:id/all",
  authenticateUserByAccessToken,
  TrainingController.getTrainingsToSuscription
);

TrainingRouter.get(
  "/:id/all/:cid",
  authenticateUserByAccessToken,
  TrainingController.getCampaignTrainingsToSuscription
);

TrainingRouter.get(
  "/:id/courses",
  authenticateUserByAccessToken,
  TrainingController.getAllCoursesByFormationId
);

TrainingRouter.put(
  "/:id/courses/:cid",
  authenticateUserByAccessToken,
  TrainingController.updateSubCoursesByFormationId
);

export default TrainingRouter;
