import { Router } from "express";
import { createUserRoutes } from "./user.routes";
import { UserController } from "../controllers/user.controller";

export interface Controllers {
  user: UserController;
}

export function createRouter(controllers: Controllers): Router {
  const router = Router();

  router.use(createUserRoutes(controllers.user));

  return router;
}
