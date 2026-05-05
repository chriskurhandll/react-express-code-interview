import { expressLogger } from "@logtape/express";

export const requestLogger = expressLogger({
  category: ["express", "http"],
  level: "info",
  format: process.env.NODE_ENV === "production" ? "combined" : "dev",
});
