import dotenv from "dotenv";
import Server from "./server";
import { Request, Response } from "express";

// Importation des routers
import TestRouter from "./routes/test.route";
import UserRouter from "./routes/user.route";
import AuthRouter from "./routes/auth.route";
import AdminUserRouter from "./routes/admin-user.route";

dotenv.config();
const PORT = Number(process.env.PORT ?? 3500);

const server = new Server(PORT);

server.start();

// appels vers tout les routeurs globales
server.use("/api/test", TestRouter);
server.use("/api/users", UserRouter);
server.use("/api/auth", AuthRouter);

// appels vers toutes les routes admins
server.use("/api/admin/users",AdminUserRouter);

// petit get Test...
server.get("/dev", (req: Request, res: Response) => {
  res.send("Bienvenue sur le backend...");
});
