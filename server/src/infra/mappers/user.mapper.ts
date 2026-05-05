import { User } from "@/domain/entities/user.entity";
import { UserDTO } from "@react-express-code-interview/shared";

export function toUserDTO(user: User): UserDTO {
  return {
    id: user.id,
    name: user.name,
  };
}
