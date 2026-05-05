import { describe, it, expect } from "vitest";
import { toUserDTO } from "@/infra/mappers/user.mapper";
import { User } from "@/domain/entities/user.entity";

describe("toUserDTO", () => {
  it("should map a User to a UserDTO", () => {
    const user = User.create({ id: 42, name: "Bob" });
    const dto = toUserDTO(user);
    expect(dto).toEqual({ id: 42, name: "Bob" });
  });
});
