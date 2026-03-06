import { FastifyInstance } from "fastify";
import { asyncWrapper } from "../middleware/async.wrapper";
import { errorHandler } from "../utils/error.handler";
import { AuthController } from "../controllers/auth.controller";
import { authSchemas } from "../schemas/auth.schema";
import { verifyToken } from "../middleware/auth.middleware";

export async function authRoutes(fastify: FastifyInstance) {
  const authController = new AuthController();

  fastify.setErrorHandler(errorHandler);

  // Public routes (no token required)
  fastify.post(
    "/login",
    { schema: authSchemas.login },
    asyncWrapper(authController.login.bind(authController)),
  );

  fastify.post(
    "/google-verify",
    { schema: authSchemas.googleVerify },
    asyncWrapper(authController.googleVerify.bind(authController)),
  );

  // Protected routes (Bearer token required)
  fastify.get(
    "/profile",
    { schema: authSchemas.getProfile, preHandler: [asyncWrapper(verifyToken)] },
    asyncWrapper(authController.getProfile.bind(authController)),
  );

  fastify.put(
    "/update-profile",
    { schema: authSchemas.updateProfile, preHandler: [asyncWrapper(verifyToken)] },
    asyncWrapper(authController.updateProfile.bind(authController)),
  );

  fastify.put(
    "/update-password",
    { schema: authSchemas.updatePassword, preHandler: [asyncWrapper(verifyToken)] },
    asyncWrapper(authController.updatePassword.bind(authController)),
  );
}
