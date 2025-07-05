import * as UserController from "../controllers/user.controller";
import express from "express";

const AuthRouter = express.Router();

AuthRouter.get("/", UserController.getAllUsers);

AuthRouter.post("/register", UserController.createAdminUser);

AuthRouter.post("/login", UserController.loginUser);

AuthRouter.put("/:id/update", UserController.updateLoginUser);

export default AuthRouter;
