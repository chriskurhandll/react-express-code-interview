import { useQuery } from "@tanstack/react-query";
import type { ListUsersDTO, PaginatedResult, UserDTO } from "@react-express-code-interview/shared";
import { apiClient } from "@/common/api/client";

export type UsersQueryParams = ListUsersDTO;

const defaultParams: UsersQueryParams = {
  page: 1,
  limit: 10,
  sortBy: "name",
  sortOrder: "desc",
};

async function fetchUsers(params: UsersQueryParams): Promise<PaginatedResult<UserDTO>> {
  const response = await apiClient.get("/users", { params });
  return response.data;
}

export function useUsers(params: Partial<UsersQueryParams> = {}) {
  const merged = { ...defaultParams, ...params };
  return useQuery({
    queryKey: ["users", merged],
    queryFn: () => fetchUsers(merged),
    placeholderData: (previousData) => previousData,
  });
}
