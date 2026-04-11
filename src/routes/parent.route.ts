import { FastifyInstance } from "fastify";
import { asyncWrapper } from "../middleware/async.wrapper";
import { errorHandler } from "../utils/error.handler";
import { ParentController } from "../controllers/parent.controller";
import { parentSchemas } from "../schemas/parent.schema";
import { verifyParentToken } from "../middleware/parent.middleware";
import { parseIntParam } from "../utils/param.parser";

export async function parentRoutes(fastify: FastifyInstance) {
  const parentController = new ParentController();

  fastify.setErrorHandler(errorHandler);

  fastify.post(
    "/signup",
    { schema: parentSchemas.signup },
    asyncWrapper(parentController.signup.bind(parentController)),
  );

  fastify.get(
    "/children",
    { schema: parentSchemas.listChildren, preHandler: [asyncWrapper(verifyParentToken)] },
    asyncWrapper(parentController.listChildren.bind(parentController)),
  );

  fastify.post(
    "/children",
    { schema: parentSchemas.addChild, preHandler: [asyncWrapper(verifyParentToken)] },
    asyncWrapper(parentController.addChild.bind(parentController)),
  );

  fastify.post(
    "/subscriptions",
    { schema: parentSchemas.createSubscription, preHandler: [asyncWrapper(verifyParentToken)] },
    asyncWrapper(parentController.createSubscription.bind(parentController)),
  );

  fastify.get(
    "/subscriptions",
    { schema: parentSchemas.listSubscriptions, preHandler: [asyncWrapper(verifyParentToken)] },
    asyncWrapper(parentController.listSubscriptions.bind(parentController)),
  );

  fastify.get(
    "/orders",
    { schema: parentSchemas.listOrders, preHandler: [asyncWrapper(verifyParentToken)] },
    asyncWrapper(parentController.listOrders.bind(parentController)),
  );

  fastify.get(
    "/orders/:order_id/fulfillments",
    {
      schema: parentSchemas.listOrderFulfillments,
      preHandler: [parseIntParam("order_id"), asyncWrapper(verifyParentToken)],
    },
    asyncWrapper(parentController.listOrderFulfillments.bind(parentController)),
  );

  fastify.get(
    "/children/:beneficiary_id/orders",
    {
      schema: parentSchemas.listOrdersForChild,
      preHandler: [parseIntParam("beneficiary_id"), asyncWrapper(verifyParentToken)],
    },
    asyncWrapper(parentController.listOrdersForChild.bind(parentController)),
  );
}
