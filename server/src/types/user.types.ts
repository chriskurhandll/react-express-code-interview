export interface User {
  id: number;
  name: string;
}

export type UserSortField = keyof User;

export type SortOrder = 'asc' | 'desc';

export interface UserQueryParams {
  sort?: UserSortField;
  order?: SortOrder;
  page: number;
  size: number;
}

export interface PagingMeta {
  totalResults: number;
  next?: string;
  previous?: string;
}

export interface UserListResponse {
  data: User[];
  paging: PagingMeta;
}
