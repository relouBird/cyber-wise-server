import * as UserController from "../controllers/user.controller";
import express from "express";

const AuthRouter = express.Router();

AuthRouter.get("/", UserController.getAllUsers);

AuthRouter.post("/register", UserController.createUser);

AuthRouter.post("/login", UserController.loginUser);

export default AuthRouter;
