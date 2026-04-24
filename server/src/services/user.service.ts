import { User, UserQueryParams, UserListResponse, PagingMeta } from '../types/user.types';
import { buildPagingUri } from '../utils/pagination';
import USERS from '../data/users.data';
import logger from '../config/logger';

export function getUsers(params: UserQueryParams, baseUrl: string): UserListResponse {
  let result: User[] = [...USERS];

  if (params.sort) {
    const field = params.sort;
    const multiplier = params.order === 'desc' ? -1 : 1;
    result.sort((a, b) => {
      if (a[field] < b[field]) return -1 * multiplier;
      if (a[field] > b[field]) return 1 * multiplier;
      return 0;
    });
    logger.debug({ field, order: params.order ?? 'asc' }, 'Sort applied');
  }

  const totalResults = result.length;
  const { page, size } = params;
  const startIndex = (page - 1) * size;
  const endIndex = startIndex + size;
  const pageData = result.slice(startIndex, endIndex);

  logger.debug({ page, size, totalResults, returned: pageData.length }, 'Pagination applied');

  const paging: PagingMeta = { totalResults };
  if (endIndex < totalResults) paging.next = buildPagingUri(params, page + 1, baseUrl);
  if (page > 1) paging.previous = buildPagingUri(params, page - 1, baseUrl);

  logger.info({ page, size, sort: params.sort, totalResults, returned: pageData.length }, 'getUsers completed');

  return { data: pageData, paging };
}
