import { Request, Response } from 'express';
import { UserSortField, SortOrder, UserQueryParams } from '../types/user.types';
import { getUsers } from '../services/user.service';
import { parseIntParam, isValidInt, toStringParam } from '../utils/pagination';
import logger from '../config/logger';

const VALID_SORT_FIELDS = new Set<string>(['id', 'name'] satisfies UserSortField[]);
const VALID_SORT_ORDERS = new Set<string>(['asc', 'desc'] satisfies SortOrder[]);
const DEFAULT_PAGE = 1;
const DEFAULT_SIZE = 10;
const MAX_SIZE = 100;

export function listUsers(req: Request, res: Response): void {
  const rawSort = toStringParam(req.query.sort);
  const rawOrder = toStringParam(req.query.order);
  const rawPage = toStringParam(req.query.page);
  const rawSize = toStringParam(req.query.size);

  if (rawSort !== undefined && !VALID_SORT_FIELDS.has(rawSort)) {
    logger.warn({ sort: rawSort, ip: req.ip }, 'Invalid sort field');
    res.status(400).json({ error: `Invalid sort field. Valid fields: ${[...VALID_SORT_FIELDS].join(', ')}` });
    return;
  }

  if (rawOrder !== undefined && !VALID_SORT_ORDERS.has(rawOrder)) {
    logger.warn({ order: rawOrder, ip: req.ip }, 'Invalid sort order');
    res.status(400).json({ error: 'Invalid order value. Use "asc" or "desc".' });
    return;
  }

  const page = parseIntParam(rawPage, DEFAULT_PAGE);
  const size = parseIntParam(rawSize, DEFAULT_SIZE);

  if (!isValidInt(page, 1, Infinity)) {
    logger.warn({ page: rawPage, ip: req.ip }, 'Invalid page param');
    res.status(400).json({ error: 'page must be a positive integer.' });
    return;
  }

  if (!isValidInt(size, 1, MAX_SIZE)) {
    logger.warn({ size: rawSize, ip: req.ip }, 'Invalid size param');
    res.status(400).json({ error: `size must be an integer between 1 and ${MAX_SIZE}.` });
    return;
  }

  const params: UserQueryParams = {
    sort: rawSort as UserSortField | undefined,
    order: rawOrder as SortOrder | undefined,
    page,
    size,
  };

  const baseUrl = `${req.protocol}://${req.get('host')}${req.path}`;
  logger.info({ ...params, ip: req.ip }, 'listUsers request');

  const result = getUsers(params, baseUrl);
  res.status(200).json(result);
}
