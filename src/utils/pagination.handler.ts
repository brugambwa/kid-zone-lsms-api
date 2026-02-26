import { FastifyReply, FastifyRequest } from "fastify";
import { logger } from "./logger";
import { ResponseHandler } from "./response";
import { parsePaginationQuery, PaginationQuery } from "./query.parser";

export interface PaginatedResult<T> {
  data: T[];
  total: number;
}

export interface PaginationMessages {
  notFound: string;
  notFoundLog: string;
  success: string;
  successLog: string;
}

export class PaginationHandler {
  /**
   * Generic handler for paginated queries
   * @param request - Fastify request
   * @param reply - Fastify reply
   * @param fetchData - Function to fetch paginated data
   * @param messages - Custom messages for this endpoint
   */
  static async handlePaginatedRequest<T>(
    request: FastifyRequest,
    reply: FastifyReply,
    fetchData: (page: number, limit: number) => Promise<PaginatedResult<T> | null>,
    messages: PaginationMessages,
  ) {
    const { page, limit } = parsePaginationQuery(request.query as PaginationQuery);

    const result = await fetchData(page, limit);

    if (!result?.data || result.data.length === 0) {
      logger.warn(messages.notFoundLog);
      return ResponseHandler.error(reply, messages.notFound, 101, 200);
    }

    const pagination = {
      page,
      limit,
      total: result.total,
      totalPages: Math.ceil(result.total / limit),
      hasNext: page * limit < result.total,
      hasPrev: page > 1,
    };

    logger.info(messages.successLog);
    return ResponseHandler.success(reply, result.data, 100, messages.success, 200, pagination);
  }

  /**
   * Create pagination metadata object
   */
  static createPagination(page: number, limit: number, total: number) {
    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    };
  }
}
