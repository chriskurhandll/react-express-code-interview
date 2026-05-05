import type { ListUsersDTO } from "@react-express-code-interview/shared"
import type { User } from "../entities/user.entity"

export interface UserRepo {
  findMany(parameters: ListUsersDTO): { data: User[]; total: number }
}
