import { User } from "@/domain/entities/user.entity";
import { getLogger } from "@logtape/logtape";
import { setupLogging } from "./infra/logging/setup";
import { UserRepoMemory } from "./infra/memory/user-repo.memory";
import { UserUsecase } from "./usecases/user.usecase";
import { createAppLogger } from "./infra/logging/logtape.logging";
import { UserController } from "./infra/http/controllers/user.controller";
import app from "./config/express";
import { createRouter } from "./infra/http/routes";
import { NextFunction, Request, Response } from "express";

async function bootstrap() {

  await setupLogging();
  const logger = getLogger(["app", "main"]);

  logger.info("Starting server");

  const seed = [
    User.create({ name: "Jorn", id: 0 }),
    User.create({ name: "Markus", id: 3 }),
    User.create({ name: "Andrew", id: 2 }),
    User.create({ name: "Ori", id: 4 }),
    User.create({ name: "Mike", id: 1 }),
  ];

  logger.info("Seed data loaded", { count: seed.length });

  const userRepo = new UserRepoMemory(seed, createAppLogger("users", "user_repo_memory"));

  const userUsecase = new UserUsecase(userRepo, createAppLogger("users", "user_usecase"));

  const userController = new UserController(userUsecase, createAppLogger("users", "user_controller"));

  app.use("/api", createRouter({ user: userController }));
  logger.info("Routes registered", { prefix: "/api" });

  app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: "Not found" });
  });

  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    logger.error("Unhandled error", {
      message: err.message,
      stack: err.stack,
    });
    res.status(500).json({ error: "Internal server error" });
  });

  const port = app.get("port");
  app.listen(port, () => {
    logger.info("Server listening", { port });
  });
}

bootstrap().catch((err) => {
  console.error("Failed to bootstrap:", err);
  process.exit(1);
});
