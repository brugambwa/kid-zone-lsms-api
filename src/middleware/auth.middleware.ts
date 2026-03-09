import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/constants";
import { HttpError } from "../utils/http.error";

export type AuthAdminPayload = {
  sub: number;
  email: string;
  access_level: string;
  status: string;
  provider: string;
};

declare module "fastify" {
  interface FastifyRequest {
    admin: AuthAdminPayload;
  }
}

const ACCESS_LEVEL_RANK: Record<string, number> = {
  support: 1,
  librarian: 2,
  admin: 3,
  super_admin: 4,
};

export async function verifyToken(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new HttpError(401, "Authorization token is missing or malformed.");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as unknown as AuthAdminPayload;
    req.admin = decoded;
  } catch {
    throw new HttpError(401, "Invalid or expired token.");
  }
}

export const requireAccessLevel = (minLevel: "support" | "librarian" | "admin" | "super_admin") => {
  return async (req: FastifyRequest, _reply: FastifyReply): Promise<void> => {
    const currentLevel = req.admin?.access_level;
    if (!currentLevel) {
      throw new HttpError(401, "Authorization token is missing or malformed.");
    }

    const currentRank = ACCESS_LEVEL_RANK[currentLevel] ?? 0;
    const requiredRank = ACCESS_LEVEL_RANK[minLevel];

    if (currentRank < requiredRank) {
      throw new HttpError(403, "You do not have permission to perform this action.");
    }
  };
};

