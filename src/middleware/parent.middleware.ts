import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/constants";
import { HttpError } from "../utils/http.error";

export type ParentJwtPayload = {
  sub: number;
  email: string;
  scope: "parent";
};

declare module "fastify" {
  interface FastifyRequest {
    parent?: ParentJwtPayload;
  }
}

export async function verifyParentToken(req: FastifyRequest, _reply: FastifyReply): Promise<void> {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new HttpError(401, "Authorization token is missing or malformed.");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as unknown as ParentJwtPayload & { scope?: string };
    if (decoded.scope !== "parent") {
      throw new HttpError(401, "Invalid token for parent routes.");
    }
    req.parent = decoded as ParentJwtPayload;
  } catch (err) {
    if (err instanceof HttpError) throw err;
    throw new HttpError(401, "Invalid or expired token.");
  }
}
