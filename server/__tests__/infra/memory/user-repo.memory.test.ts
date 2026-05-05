import { describe, it, expect, vi } from "vitest";
import { UserRepoMemory } from "@/infra/memory/user-repo.memory";
import { User } from "@/domain/entities/user.entity";
import type { Logger } from "@react-express-code-interview/shared";

const mockLogger: Logger = {
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};

const seed = [
  User.create({ id: 1, name: "Charlie" }),
  User.create({ id: 2, name: "Alice" }),
  User.create({ id: 3, name: "Bob" }),
  User.create({ id: 4, name: "Alex" }),
];

describe("UserRepoMemory", () => {
  it("should return paginated results", () => {
    const repo = new UserRepoMemory(seed, mockLogger);
    const result = repo.findMany({ page: 1, limit: 2, sortBy: "id", sortOrder: "asc" });

    expect(result.data).toHaveLength(2);
    expect(result.total).toBe(4);
    expect(result.data[0].id).toBe(1);
    expect(result.data[1].id).toBe(2);
  });

  it("should return the second page", () => {
    const repo = new UserRepoMemory(seed, mockLogger);
    const result = repo.findMany({ page: 2, limit: 2, sortBy: "id", sortOrder: "asc" });

    expect(result.data).toHaveLength(2);
    expect(result.data[0].id).toBe(3);
    expect(result.data[1].id).toBe(4);
  });

  it("should sort ascending by name", () => {
    const repo = new UserRepoMemory(seed, mockLogger);
    const result = repo.findMany({ page: 1, limit: 10, sortBy: "name", sortOrder: "asc" });

    expect(result.data.map((u) => u.name)).toEqual(["Alex", "Alice", "Bob", "Charlie"]);
  });

  it("should sort descending by name", () => {
    const repo = new UserRepoMemory(seed, mockLogger);
    const result = repo.findMany({ page: 1, limit: 10, sortBy: "name", sortOrder: "desc" });

    expect(result.data.map((u) => u.name)).toEqual(["Charlie", "Bob", "Alice", "Alex"]);
  });

  it("should filter by search term case-insensitively", () => {
    const repo = new UserRepoMemory(seed, mockLogger);
    const result = repo.findMany({ page: 1, limit: 10, sortBy: "name", sortOrder: "asc", search: "al" });

    expect(result.data.map((u) => u.name)).toEqual(["Alex", "Alice"]);
    expect(result.total).toBe(2);
  });

  it("should return empty array when search matches nothing", () => {
    const repo = new UserRepoMemory(seed, mockLogger);
    const result = repo.findMany({ page: 1, limit: 10, sortBy: "name", sortOrder: "asc", search: "zzz" });

    expect(result.data).toEqual([]);
    expect(result.total).toBe(0);
  });

  it("should apply pagination after sorting and filtering", () => {
    const repo = new UserRepoMemory(seed, mockLogger);
    const result = repo.findMany({
      page: 1,
      limit: 1,
      sortBy: "name",
      sortOrder: "asc",
      search: "al",
    });

    expect(result.data).toHaveLength(1);
    expect(result.data[0].name).toBe("Alex");
    expect(result.total).toBe(2);
  });
});
