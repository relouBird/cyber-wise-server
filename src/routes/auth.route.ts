import * as UserController from "../controllers/user.controller";
import express from "express";

const AuthRouter = express.Router();

AuthRouter.get("/", UserController.getAllUsers);

AuthRouter.post("/register", UserController.createAdminUser);

AuthRouter.post("/login", UserController.loginUser);

export default AuthRouter;
