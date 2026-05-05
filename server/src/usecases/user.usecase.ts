import { User } from "@/domain/entities/user.entity";
import { UserRepo } from "@/domain/repos/user.repo";
import { ListUsersDTO, RawData, Logger } from "@react-express-code-interview/shared";


export class UserUsecase {

  constructor(private readonly userRepo: UserRepo, private readonly logger: Logger) { }

  listUsers(parameters: ListUsersDTO): RawData<User> {
    this.logger.debug("UserUsecase.listUsers", { parameters });
    const result = this.userRepo.findMany(parameters);
    this.logger.debug("UserUsecase.listUsers result", { count: result.data.length, total: result.total });
    return result;
  }

}
