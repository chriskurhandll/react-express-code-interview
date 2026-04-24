export interface PagingParams {
  page: number;
  size: number;
  sort?: string;
  order?: string;
}

export function toStringParam(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

export function parseIntParam(raw: string | undefined, defaultVal: number): number {
  return raw !== undefined ? parseInt(raw, 10) : defaultVal;
}

export function isValidInt(value: number, min: number, max: number): boolean {
  return !isNaN(value) && Number.isInteger(value) && value >= min && value <= max;
}

export function buildPagingUri(params: PagingParams, targetPage: number, baseUrl: string): string {
  const qs = new URLSearchParams();
  qs.set('page', String(targetPage));
  qs.set('size', String(params.size));
  if (params.sort) qs.set('sort', params.sort);
  if (params.order) qs.set('order', params.order);
  return `${baseUrl}?${qs.toString()}`;
}
