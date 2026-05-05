import { Request } from "express";
import { z } from "zod";

interface BasePaginationParameters {
  page: number;
  limit: number;
}

export interface RawData<T> {
  data: T[];
  total: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  next: string | null;
  previous: string | null;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

export function createPaginationSchema<T extends readonly [string, ...string[]]>(
  sortableFields: T,
  defaultSortBy: T[number],
) {
  return z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    sortBy: z.enum(sortableFields).optional().transform(v => v ?? defaultSortBy),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
  });
}

export function buildPaginatedResult<T>(
  data: T[],
  total: number,
  params: BasePaginationParameters,
  req: Request,
): PaginatedResult<T> {
  const totalPages = Math.ceil(total / params.limit);
  const hasNext = params.page < totalPages;
  const hasPrevious = params.page > 1;

  return {
    data,
    meta: {
      page: params.page,
      limit: params.limit,
      total,
      totalPages,
      next: hasNext ? buildPageUrl(req, params.page + 1) : null,
      previous: hasPrevious ? buildPageUrl(req, params.page - 1) : null,
    },
  };
}

function buildPageUrl(req: Request, page: number): string {
  const protocol = req.protocol;
  const host = req.get("host");
  const url = new URL(`${protocol}://${host}${req.baseUrl}${req.path}`);


  for (const [key, value] of Object.entries(req.query)) {
    if (typeof value === "string") {
      url.searchParams.set(key, value);
    }
  }
  url.searchParams.set("page", String(page));

  return url.toString();
}
