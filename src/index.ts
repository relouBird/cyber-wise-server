import dotenv from "dotenv";
import Server from "./server";
import { Request, Response } from "express";

// Importation des routers
import TestRouter from "./routes/test.route";
import UserRouter from "./routes/user.route";
import AuthRouter from "./routes/auth.route";
import AdminUserRouter from "./routes/admin-user.route";
import AdminTrainingsRouter from "./routes/admin-trainings.route";
import AdminDomainsRouter from "./routes/admin-domains.route";
import AdminCoursesRouter from "./routes/admin-courses.route";

dotenv.config();
const PORT = Number(process.env.PORT ?? 3500);

const server = new Server(PORT);

server.start();

// appels vers tout les routeurs globales
server.use("/api/test", TestRouter);
server.use("/api/users", UserRouter);
server.use("/api/auth", AuthRouter);

// appels vers toutes les routes admins
server.use("/api/admin/users", AdminUserRouter);
server.use("/api/admin/domains", AdminDomainsRouter);
server.use("/api/admin/trainings", AdminTrainingsRouter);
server.use("/api/admin/courses", AdminCoursesRouter);

// petit get Test...
server.get("/dev", (req: Request, res: Response) => {
  res.send("Bienvenue sur le backend...");
});
