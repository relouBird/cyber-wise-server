import * as UserController from "../controllers/user.controller";
import express from "express";
import { authenticateUserByAccessToken } from "../helpers/auth.helper";

const AdminUserRouter = express.Router();

AdminUserRouter.get(
  "/",
  authenticateUserByAccessToken,
  UserController.getAllUsers
);

AdminUserRouter.get(
  "/:id",
  authenticateUserByAccessToken,
  UserController.getAllUsersByOrgId
);

AdminUserRouter.put(
  "/:id",
  authenticateUserByAccessToken,
  UserController.updateUser
);

AdminUserRouter.delete(
  "/:id",
  authenticateUserByAccessToken,
  UserController.deleteUser
);

AdminUserRouter.post(
  "/",
  authenticateUserByAccessToken,
  UserController.createUser
);

export default AdminUserRouter;
