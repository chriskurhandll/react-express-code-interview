import { User } from "@/domain/entities/user.entity";
import { UserRepo } from "@/domain/repos/user.repo";
import { ListUsersDTO, Logger, RawData } from "@react-express-code-interview/shared";

export class UserRepoMemory implements UserRepo {
  private database: User[];

  constructor(seed: User[] = [], private readonly logger: Logger) {
    this.database = [...seed];
  }

  findMany({ limit, page, sortOrder, search, sortBy }: ListUsersDTO): RawData<User> {
    let result = [...this.database];
    const totalBeforeFilter = result.length;

    if (search) {
      const needle = search.toLowerCase();
      result = result.filter(user =>
        user.name.toLowerCase().includes(needle)
      );
      this.logger.debug("UserRepo.findMany filtered by search", { search, matched: result.length });
    }

    const total = result.length;

    result.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    const offset = (page - 1) * limit;
    const data = result.slice(offset, offset + limit);

    this.logger.debug("UserRepo.findMany", {
      totalBeforeFilter,
      totalAfterFilter: total,
      returned: data.length,
      page,
      limit,
      offset,
      sortBy,
      sortOrder,
    });

    return { data, total };
  }
}
