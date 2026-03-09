import { FastifyInstance } from "fastify";
import { asyncWrapper } from "../middleware/async.wrapper";
import { errorHandler } from "../utils/error.handler";
import { AdminsController } from "../controllers/admins.controller";
import { adminsSchemas } from "../schemas/admins.schema";
import { parseIntParam } from "../utils/param.parser";
import { requireAccessLevel, verifyToken } from "../middleware/auth.middleware";

export async function adminsRoutes(fastify: FastifyInstance) {
  const adminsController = new AdminsController();

  fastify.setErrorHandler(errorHandler);

  // List admins - any logged-in admin (support and above)
  fastify.get(
    "/",
    {
      schema: adminsSchemas.listAdmins,
      preHandler: [asyncWrapper(verifyToken), asyncWrapper(requireAccessLevel("support"))],
    },
    asyncWrapper(adminsController.listAdmins.bind(adminsController)),
  );

  // Get single admin - any logged-in admin
  fastify.get(
    "/:admin_id",
    {
      schema: adminsSchemas.getAdminById,
      preHandler: [parseIntParam("admin_id"), asyncWrapper(verifyToken), asyncWrapper(requireAccessLevel("support"))],
    },
    asyncWrapper(adminsController.getAdminById.bind(adminsController)),
  );

  // Create admin - admin and super_admin
  fastify.post(
    "/",
    {
      schema: adminsSchemas.createAdmin,
      preHandler: [asyncWrapper(verifyToken), asyncWrapper(requireAccessLevel("admin"))],
    },
    asyncWrapper(adminsController.createAdmin.bind(adminsController)),
  );

  // Update admin - admin and super_admin
  fastify.put(
    "/:admin_id",
    {
      schema: adminsSchemas.updateAdmin,
      preHandler: [parseIntParam("admin_id"), asyncWrapper(verifyToken), asyncWrapper(requireAccessLevel("admin"))],
    },
    asyncWrapper(adminsController.updateAdmin.bind(adminsController)),
  );

  // Delete admin - super_admin only
  fastify.delete(
    "/:admin_id",
    {
      schema: adminsSchemas.deleteAdmin,
      preHandler: [
        parseIntParam("admin_id"),
        asyncWrapper(verifyToken),
        asyncWrapper(requireAccessLevel("super_admin")),
      ],
    },
    asyncWrapper(adminsController.deleteAdmin.bind(adminsController)),
  );
}

