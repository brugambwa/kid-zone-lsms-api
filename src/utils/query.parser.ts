// utils/query-parser.ts
export interface PaginationQuery {
  page?: string;
  limit?: string;
}

export interface ParsedPagination {
  page: number;
  limit: number;
}

// Define constant outside function
const DEFAULT_PAGINATION = {
  page: 1,
  limit: 10,
  maxLimit: 100,
} as const;

export const parsePaginationQuery = (
  query: PaginationQuery,
  defaults = DEFAULT_PAGINATION,
): ParsedPagination => {
  const page = query.page ? Number.parseInt(query.page, 10) : defaults.page;
  const limit = query.limit ? Number.parseInt(query.limit, 10) : defaults.limit;

  // Validate and constrain values
  const pageNum = Math.max(1, Number.isNaN(page) ? defaults.page : page);
  const limitNum = Math.min(defaults.maxLimit, Math.max(1, Number.isNaN(limit) ? defaults.limit : limit));

  return { page: pageNum, limit: limitNum };
};
