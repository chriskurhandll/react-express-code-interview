import { describe, it, expect, vi } from "vitest";
import { UserController } from "@/infra/http/controllers/user.controller";
import { UserUsecase } from "@/usecases/user.usecase";
import { User } from "@/domain/entities/user.entity";
import type { Request, Response, NextFunction } from "express";
import type { Logger } from "@react-express-code-interview/shared";

const mockLogger: Logger = {
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};

function createMockReq(query: Record<string, string> = {}): Partial<Request> {
  return {
    query: query as Request["query"],
    protocol: "http",
    get: vi.fn().mockReturnValue("localhost:3001"),
    baseUrl: "/api",
    path: "/users",
  };
}

function createMockRes(): Partial<Response> {
  const res: Partial<Response> = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
}

describe("UserController.list", () => {
  it("should return 200 with paginated users for valid query", async () => {
    const users = [User.create({ id: 1, name: "Alice" })];
    const mockUsecase = {
      listUsers: vi.fn().mockReturnValue({ data: users, total: 1 }),
    } as unknown as UserUsecase;

    const controller = new UserController(mockUsecase, mockLogger);
    const req = createMockReq({ page: "1", limit: "10" });
    const res = createMockRes();
    const next = vi.fn();

    await controller.list(req as Request, res as Response, next as NextFunction);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        data: [{ id: 1, name: "Alice" }],
        meta: expect.objectContaining({
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
          next: null,
          previous: null,
        }),
      }),
    );
  });

  it("should return 400 for invalid query parameters", async () => {
    const mockUsecase = {
      listUsers: vi.fn(),
    } as unknown as UserUsecase;

    const controller = new UserController(mockUsecase, mockLogger);
    const req = createMockReq({ page: "0", limit: "-1" });
    const res = createMockRes();
    const next = vi.fn();

    await controller.list(req as Request, res as Response, next as NextFunction);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: "Invalid query parameters",
        issues: expect.any(Array),
      }),
    );
    expect(mockUsecase.listUsers).not.toHaveBeenCalled();
  });

  it("should call next with error when usecase throws", async () => {
    const error = new Error("DB failure");
    const mockUsecase = {
      listUsers: vi.fn().mockImplementation(() => {
        throw error;
      }),
    } as unknown as UserUsecase;

    const controller = new UserController(mockUsecase, mockLogger);
    const req = createMockReq({ page: "1", limit: "10" });
    const res = createMockRes();
    const next = vi.fn();

    await controller.list(req as Request, res as Response, next as NextFunction);

    expect(next).toHaveBeenCalledWith(error);
  });
});
