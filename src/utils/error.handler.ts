// src/utils/error.handler.ts
import { FastifyError, FastifyReply, FastifyRequest } from "fastify";

export const errorHandler = (error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
  // Schema validation errors
  if (error?.validation) {
    return reply.status(400).send({
      success: false,
      resp_code: 400,
      resp_msg: "Validation Error",
      error: error.message ?? "Validation failed", // Use nullish coalescing
      details: error.validation,
    });
  }

  // Custom application errors
  if (error?.statusCode) {
    return reply.status(error.statusCode).send({
      success: false,
      resp_code: error.statusCode,
      resp_msg: error.name || "Error",
      error: error.message ?? "An error occurred", // Use nullish coalescing
    });
  }

  // Default server errors
  console.error(error);
  return reply.status(500).send({
    success: false,
    resp_code: 500,
    resp_msg: "Internal Server Error",
    error: "An unexpected error occurred",
  });
};
