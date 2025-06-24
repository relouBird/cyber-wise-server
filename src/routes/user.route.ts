import * as UserController from "../controllers/user.controller";
import express from "express";

const UserRouter = express.Router();

UserRouter.get("/", UserController.getAllUsers);

UserRouter.post("/", UserController.createAdminUser);

export default UserRouter;
