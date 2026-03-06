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
