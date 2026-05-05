import z from "zod";
import { createPaginationSchema } from "../../common/pagination"

export const ListUsersDTO = createPaginationSchema(
  ["id", "name"] as const,
  "name",
).extend({
  search: z.string().optional(),
});

export type ListUsersDTO = z.infer<typeof ListUsersDTO>;
