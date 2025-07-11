import * as TrainingController from "../controllers/trainings.controller";
import express from "express";
import { authenticateUserByAccessToken } from "../helpers/auth.helper";
import multer from "multer";

const TrainingRouter = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

TrainingRouter.get(
  "/",
  authenticateUserByAccessToken,
  TrainingController.getTrainingsToSuscription
);

TrainingRouter.get(
  "/:id/courses",
  authenticateUserByAccessToken,
  TrainingController.getAllTrainings
);


export default TrainingRouter;
