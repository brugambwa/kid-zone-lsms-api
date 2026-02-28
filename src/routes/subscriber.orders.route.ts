import { FastifyInstance } from "fastify";
import { asyncWrapper } from "../middleware/async.wrapper";
import { errorHandler } from "../utils/error.handler";
import { parseIntParam } from "../utils/param.parser";
import { SubscriberOrdersController } from "../controllers/subscriber.orders.controller";
import { subscriberOrdersSchemas } from "../schemas/subscriber.orders.schema";

export async function subscriberOrdersRoutes(fastify: FastifyInstance) {
  const subscriberOrders = new SubscriberOrdersController();

  fastify.setErrorHandler(errorHandler);

  fastify.get(
    "/:order_id",
    { schema: subscriberOrdersSchemas.getByOrderID, preHandler: [parseIntParam("order_id")] },
    asyncWrapper(subscriberOrders.getByOrderID.bind(subscriberOrders)),
  );
  fastify.get(
    "/",
    { schema: subscriberOrdersSchemas.getAllOrders },
    asyncWrapper(subscriberOrders.getAllOrders.bind(subscriberOrders)),
  );
  fastify.get(
    "/subscriber/:subscriber_id",
    {
      schema: subscriberOrdersSchemas.getBySubscriberID,
      preHandler: [parseIntParam("subscriber_id")],
    },
    asyncWrapper(subscriberOrders.getBySubscriberID.bind(subscriberOrders)),
  );
  fastify.get(
    "/beneficiary/:beneficiary_id",
    {
      schema: subscriberOrdersSchemas.getByBeneficiaryID,
      preHandler: [parseIntParam("beneficiary_id")],
    },
    asyncWrapper(subscriberOrders.getByBeneficiaryID.bind(subscriberOrders)),
  );
  fastify.get(
    "/status/:order_status",
    { schema: subscriberOrdersSchemas.getByStatus },
    asyncWrapper(subscriberOrders.getByStatus.bind(subscriberOrders)),
  );
}
