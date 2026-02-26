import { FastifyReply, FastifyRequest } from "fastify";
import { ResponseHandler } from "../utils/response";
import { ExceptionProcessor, HttpError } from "../utils/http.error";
import { mapPrismaError } from "../utils/prisma.error";
import { logger } from "../utils/logger";

interface ErrorWithResponse {
  response?: {
    status?: number;
    data?: any;
  };
}

function hasResponse(err: unknown): err is ErrorWithResponse {
  return (
    typeof err === "object" && err !== null && "response" in err && typeof (err as any).response === "object"
  );
}

type ErrorHandler = (reply: FastifyReply, err: unknown) => boolean;

const errorHandlers: ErrorHandler[] = [
  // Prisma error handler
  (reply, err) => {
    const prismaErr = mapPrismaError(err);
    if (!prismaErr) return false;
    ResponseHandler.error(reply, prismaErr, prismaErr.code, prismaErr.status);
    return true;
  },

  // HttpError handler
  (reply, err) => {
    if (!(err instanceof HttpError)) return false;
    ResponseHandler.error(reply, err, 101, err.statusCode);
    return true;
  },

  // Response error handler
  (reply, err) => {
    if (!hasResponse(err)) return false;
    logger.debug("Error response data:", err.response?.data);

    try {
      ExceptionProcessor.handle(err);
    } catch (error_) {
      if (error_ instanceof HttpError) {
        ResponseHandler.error(reply, error_, 101, error_.statusCode);
        return true;
      }
    }
    return false;
  },
];

export function asyncWrapper(fn: (request: FastifyRequest, reply: FastifyReply) => Promise<any>) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      return await fn(request, reply);
    } catch (err: unknown) {
      logger.error("Error in async wrapper:", err);

      // Try each handler until one succeeds
      const handled = errorHandlers.some((handler) => handler(reply, err));

      // Default error handling if no handler succeeded
      if (!handled) {
        const errorMessage = err instanceof Error ? err : new Error("Unknown error");
        ResponseHandler.error(reply, errorMessage, 999, 500);
      }
    }
  };
}
