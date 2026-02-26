// utils/validators.ts
import { FastifyRequest, FastifyReply, preHandlerAsyncHookHandler } from "fastify";

interface ParsedIntParams {
  [key: string]: number;
}

export const parseIntParam = (paramName: string): preHandlerAsyncHookHandler => {
  const handler = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const params = request.params as Record<string, string>;
    const paramValue = params[paramName];

    if (!paramValue) {
      await reply.status(400).send({
        success: false,
        resp_code: 400,
        resp_msg: `Missing required parameter: ${paramName}`,
        data: null,
      });
      return;
    }

    const parsed = Number.parseInt(paramValue, 10);

    if (Number.isNaN(parsed) || parsed <= 0) {
      await reply.status(400).send({
        success: false,
        resp_code: 400,
        resp_msg: `Invalid ${paramName}: must be a positive integer`,
        data: null,
      });
      return;
    }

    // Modify params in place with parsed value
    (params as any)[paramName] = parsed;
  };

  return handler;
};
