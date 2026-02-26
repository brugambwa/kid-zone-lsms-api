import { FastifyReply } from "fastify";
import { serializePrimitives } from "./serialize";

export class ResponseHandler {
  static success(
    reply: FastifyReply,
    data: any,
    resp_code: number = 100,
    message: string = "Request successful",
    statusCode: number = 200,
    pagination?: any,
  ) {
    if (reply.sent) {
      reply.log.warn("Attempted to send success response after headers were already sent");
      return;
    }
    return reply.status(statusCode).send({
      success: true,
      resp_msg: message,
      resp_code,
      data: serializePrimitives(data),
      pagination,
    });
  }

  // In response.ts - Update the error method
  static error(
    reply: FastifyReply,
    error: any,
    resp_code: number = 101,
    statusCode: number = 400,
    data?: any,
  ) {
    if (reply.sent) {
      reply.log.error("Attempted to send error response after headers were already sent", error);
      return;
    }

    // Determine the error message - always ensure it's a string
    let errorMessage: string;
    if (typeof error === "string" && error.trim() !== "") {
      // Handle string errors, but reject empty strings
      errorMessage = error;
    } else if (error?.message && typeof error.message === "string" && error.message.trim() !== "") {
      // Handle error objects with message property
      errorMessage = error.message;
    } else {
      // Default fallback for everything else
      errorMessage = "Something went wrong";
    }

    const response: {
      success: boolean;
      resp_msg: string;
      resp_code: number;
      errors: any;
      data?: any;
    } = {
      success: false,
      resp_msg: errorMessage,
      resp_code,
      errors: error?.details || null,
    };

    // Only include data field if explicitly provided or exists in error object
    if (data !== undefined) {
      response.data = data;
    } else if (error?.emptyData !== undefined) {
      response.data = error.emptyData;
    }

    return reply.status(statusCode).send(response);
  }
}

export const errorResponseSchema = {
  description: "Error response",
  type: "object",
  properties: {
    success: { type: "boolean" },
    resp_msg: { type: "string" },
    resp_code: { type: "integer" },
    errors: { type: ["object", "null"] },
    data: {},
  },
};
