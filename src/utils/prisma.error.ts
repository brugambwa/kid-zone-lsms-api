// src/utils/prisma-error.ts
import { Prisma } from "@prisma/client";

export type CleanApiError = {
  status: number;
  code: number; // your app-level code
  message: string;
  details?: Record<string, unknown>; // optional, sanitized
};

export function mapPrismaError(err: unknown): CleanApiError | null {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // https://www.prisma.io/docs/reference/api-reference/error-reference
    switch (err.code) {
      case "P2002": // Unique constraint failed
        return { status: 409, code: 170, message: "Unique constraint failed: Resource already exists." };
      case "P2003": // Foreign key constraint failed
        return {
          status: 400,
          code: 171,
          message: "Foreign key constraint failed: Invalid relation reference.",
        };
      case "P2000": // Value too long for column
        return { status: 400, code: 172, message: "Invalid value length." };
      case "P2025": // Record not found
        return { status: 404, code: 173, message: "Resource not found." };
      default:
        return { status: 400, code: 174, message: "Invalid request." };
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return { status: 400, code: 175, message: "Invalid payload." };
  }

  if (err instanceof Prisma.PrismaClientInitializationError) {
    // DB down, bad connection string, etc.
    return {
      status: 503,
      code: 179,
      message: "Service temporarily unavailable.",
    };
  }

  if (err instanceof Prisma.PrismaClientRustPanicError) {
    return { status: 500, code: 999, message: "Internal error." };
  }

  return null; // not a Prisma error
}
