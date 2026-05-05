import { Router } from "express";
import { UserController } from "../controllers/user.controller";


export function createUserRoutes(controller: UserController): Router {
  const router = Router();

  router.get("/users", controller.list);

  return router;
}
