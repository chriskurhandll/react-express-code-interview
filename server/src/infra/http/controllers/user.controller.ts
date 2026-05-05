import { Request, Response, NextFunction } from "express";
import { buildPaginatedResult, ListUsersDTO, Logger } from "@react-express-code-interview/shared";
import { UserUsecase } from "@/usecases/user.usecase";
import { toUserDTO } from "@/infra/mappers/user.mapper";

export class UserController {
  constructor(private readonly userUsecase: UserUsecase, private readonly logger: Logger) {}

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = ListUsersDTO.safeParse(req.query ?? {});
      if (!parsed.success) {
        this.logger.warn("Invalid list users query", { issues: parsed.error.issues });
        return res.status(400).json({
          error: "Invalid query parameters",
          issues: parsed.error.issues,
        });
      }

      const { data, total } = this.userUsecase.listUsers(parsed.data);
      const dtos = data.map(toUserDTO);
      const result = buildPaginatedResult(dtos, total, parsed.data, req);

      this.logger.info("List users success", {
        page: result.meta.page,
        limit: result.meta.limit,
        total: result.meta.total,
        totalPages: result.meta.totalPages,
        returned: result.data.length,
      });

      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };
}
