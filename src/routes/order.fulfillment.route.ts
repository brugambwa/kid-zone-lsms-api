import { FastifyInstance } from "fastify";
import { asyncWrapper } from "../middleware/async.wrapper";
import { errorHandler } from "../utils/error.handler";
import { parseIntParam } from "../utils/param.parser";
import { OrderFulfillmentController } from "../controllers/order.fulfillment.controller";
import { orderFulfillmentSchemas } from "../schemas/order.fulfillment.schema";

export async function orderFulfillmentRoutes(fastify: FastifyInstance) {
  const orderFulfillmentController = new OrderFulfillmentController();

  fastify.setErrorHandler(errorHandler);

  fastify.post(
    "/",
    { schema: orderFulfillmentSchemas.createFulfillment },
    asyncWrapper(orderFulfillmentController.createOrderFulfillment.bind(orderFulfillmentController)),
  );
  fastify.get(
    "/:fulfillment_id",
    { schema: orderFulfillmentSchemas.getByID, preHandler: [parseIntParam("fulfillment_id")] },
    asyncWrapper(orderFulfillmentController.getByID.bind(orderFulfillmentController)),
  );
  fastify.get(
    "/",
    { schema: orderFulfillmentSchemas.getAll },
    asyncWrapper(orderFulfillmentController.getAll.bind(orderFulfillmentController)),
  );
  fastify.get(
    "/order/:order_id",
    { schema: orderFulfillmentSchemas.getByOrderID, preHandler: [parseIntParam("order_id")] },
    asyncWrapper(orderFulfillmentController.getByOrderID.bind(orderFulfillmentController)),
  );
  fastify.get(
    "/status/:fulfillment_status",
    { schema: orderFulfillmentSchemas.getByStatus },
    asyncWrapper(orderFulfillmentController.getByStatus.bind(orderFulfillmentController)),
  );
  fastify.get(
    "/fulfillment-date",
    { schema: orderFulfillmentSchemas.getByFulfillmentDateRange },
    asyncWrapper(orderFulfillmentController.getByFulfillmentDateRange.bind(orderFulfillmentController)),
  );
  fastify.get(
    "/expected-return-date",
    { schema: orderFulfillmentSchemas.getByExpectedReturnDateRange },
    asyncWrapper(orderFulfillmentController.getByExpectedReturnDateRange.bind(orderFulfillmentController)),
  );
  fastify.put(
    "/:fulfillment_id",
    { schema: orderFulfillmentSchemas.updateOrderFulfillment, preHandler: [parseIntParam("fulfillment_id")] },
    asyncWrapper(orderFulfillmentController.updateOrderFulfillment.bind(orderFulfillmentController)),
  );
  fastify.delete(
    "/:fulfillment_id",
    { schema: orderFulfillmentSchemas.deleteOrderFulfillment, preHandler: [parseIntParam("fulfillment_id")] },
    asyncWrapper(orderFulfillmentController.deleteOrderFulfillment.bind(orderFulfillmentController)),
  );
}
