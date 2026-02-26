import { FastifyInstance } from "fastify";
import { asyncWrapper } from "../middleware/async.wrapper";
import { errorHandler } from "../utils/error.handler";
import { parseIntParam } from "../utils/param.parser";
import { SubscribersController } from "../controllers/subscriber.controller";
import { subscriberSchemas } from "../schemas/subscriber.schema";

export async function subscriberRoutes(fastify: FastifyInstance) {
  const subscribers = new SubscribersController();

  fastify.setErrorHandler(errorHandler);

  fastify.post(
    "/",
    { schema: subscriberSchemas.createSubscriber },
    asyncWrapper(subscribers.createSubscriber.bind(subscribers)),
  );
  fastify.get(
    "/",
    { schema: subscriberSchemas.getAllSubscribers },
    asyncWrapper(subscribers.getAllSubscribers.bind(subscribers)),
  );
  fastify.get(
    "/:subscriber_id",
    { schema: subscriberSchemas.getSubscriberByID, preHandler: [parseIntParam("subscriber_id")] },
    asyncWrapper(subscribers.getSubscriberByID.bind(subscribers)),
  );
  fastify.get(
    "/email/:email",
    { schema: subscriberSchemas.getSubscriberByEmail },
    asyncWrapper(subscribers.getSubscriberByEmail.bind(subscribers)),
  );
  fastify.put(
    "/:subscriber_id",
    { schema: subscriberSchemas.updateSubscriber, preHandler: [parseIntParam("subscriber_id")] },
    asyncWrapper(subscribers.updateSubscriber.bind(subscribers)),
  );
  fastify.delete(
    "/:subscriber_id",
    { schema: subscriberSchemas.deleteSubscriber, preHandler: [parseIntParam("subscriber_id")] },
    asyncWrapper(subscribers.deleteSubscriber.bind(subscribers)),
  );
}
