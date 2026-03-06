import { FastifyInstance } from "fastify";
import { asyncWrapper } from "../middleware/async.wrapper";
import { errorHandler } from "../utils/error.handler";
import { AuthController } from "../controllers/auth.controller";
import { authSchemas } from "../schemas/auth.schema";

export async function authRoutes(fastify: FastifyInstance) {
  const authController = new AuthController();

  fastify.setErrorHandler(errorHandler);

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
}

