import * as TrainingsController from "../controllers/trainings.controller";
import express from "express";
import { authenticateUserByAccessToken } from "../helpers/auth.helper";
import multer from "multer";

const AdminTrainingsRouter = express.Router();

const upload = multer({ dest: "uploads/" });

AdminTrainingsRouter.get(
  "/",
  authenticateUserByAccessToken,
  TrainingsController.getAllTrainings
);

AdminTrainingsRouter.post(
  "/",
  authenticateUserByAccessToken,
  upload.single("image"),
  TrainingsController.createTrainings
);

AdminTrainingsRouter.put(
  "/:id",
  authenticateUserByAccessToken,
  TrainingsController.updateTrainings
);

AdminTrainingsRouter.delete(
  "/:id",
  authenticateUserByAccessToken,
  TrainingsController.deleteTrainings
);

AdminTrainingsRouter.delete(
  "/many",
  authenticateUserByAccessToken,
  TrainingsController.deleteManyTrainings
);

export default AdminTrainingsRouter;
