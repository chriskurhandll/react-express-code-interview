import { describe, it, expect } from "vitest";
import { User } from "@/domain/entities/user.entity";

describe("User", () => {
  it("should create a user with id and name", () => {
    const user = User.create({ id: 1, name: "Alice" });
    expect(user.id).toBe(1);
    expect(user.name).toBe("Alice");
  });
});
