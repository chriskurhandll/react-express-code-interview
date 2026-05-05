import { describe, it, expect, vi } from "vitest";
import { UserUsecase } from "@/usecases/user.usecase";
import { User } from "@/domain/entities/user.entity";
import type { UserRepo } from "@/domain/repos/user.repo";
import type { Logger } from "@react-express-code-interview/shared";

const mockLogger: Logger = {
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};

describe("UserUsecase", () => {
  it("should return paginated users from the repository", () => {
    const users = [User.create({ id: 1, name: "Alice" })];
    const mockRepo: UserRepo = {
      findMany: vi.fn().mockReturnValue({ data: users, total: 1 }),
    };

    const usecase = new UserUsecase(mockRepo, mockLogger);
    const params = { page: 1, limit: 10, sortBy: "name" as const, sortOrder: "asc" as const };
    const result = usecase.listUsers(params);

    expect(mockRepo.findMany).toHaveBeenCalledWith(params);
    expect(result).toEqual({ data: users, total: 1 });
  });
});
