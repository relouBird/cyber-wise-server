import * as CoursesController from "../controllers/courses.controller";
import express from "express";
import { authenticateUserByAccessToken } from "../helpers/auth.helper";
import multer from "multer";

const AdminCoursesRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // ✅ Correct

AdminCoursesRouter.get(
  "/",
  authenticateUserByAccessToken,
  CoursesController.getAllCourses
);

AdminCoursesRouter.get(
  "/training/:id",
  authenticateUserByAccessToken,
  CoursesController.getAllCoursesByFormationId
);

AdminCoursesRouter.post(
  "/",
  authenticateUserByAccessToken,
  upload.single("image"),
  CoursesController.createCourse
);

AdminCoursesRouter.get(
  "/:id",
  authenticateUserByAccessToken,
  CoursesController.getCourse
);

AdminCoursesRouter.put(
  "/:id",
  authenticateUserByAccessToken,
  upload.single("image"),
  CoursesController.updateCourse
);

AdminCoursesRouter.delete(
  "/:id",
  authenticateUserByAccessToken,
  CoursesController.deleteCourse
);

AdminCoursesRouter.delete(
  "/training/:id",
  authenticateUserByAccessToken,
  CoursesController.deleteCoursesbyFormationId
);

export default AdminCoursesRouter;
