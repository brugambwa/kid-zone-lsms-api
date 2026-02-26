import { FastifyInstance } from "fastify";
import { asyncWrapper } from "../middleware/async.wrapper";
import { errorHandler } from "../utils/error.handler";
import { parseIntParam } from "../utils/param.parser";
import { SubscriptionsController } from "../controllers/subscriptions.controller";
import { subscriptionSchemas } from "../schemas/subscriptions.schema";

export async function subscriptionsRoutes(fastify: FastifyInstance) {
  const subscriptions = new SubscriptionsController();

  fastify.setErrorHandler(errorHandler);

  fastify.post(
    "/",
    { schema: subscriptionSchemas.createSubscription },
    asyncWrapper(subscriptions.createSubscription.bind(subscriptions)),
  );
  fastify.get(
    "/",
    { schema: subscriptionSchemas.getAll },
    asyncWrapper(subscriptions.getAllSubscriptions.bind(subscriptions)),
  );
  fastify.get(
    "/subscriber/:subscriber_id",
    { schema: subscriptionSchemas.getBySubscriberID, preHandler: [parseIntParam("subscriber_id")] },
    asyncWrapper(subscriptions.getBySubscriberID.bind(subscriptions)),
  );
  fastify.get(
    "/status/:status",
    { schema: subscriptionSchemas.getByStatus },
    asyncWrapper(subscriptions.getByStatus.bind(subscriptions)),
  );
  fastify.get(
    "/frequency/:frequency",
    { schema: subscriptionSchemas.getByFrequency },
    asyncWrapper(subscriptions.getByFrequency.bind(subscriptions)),
  );
  fastify.get(
    "/expiry",
    { schema: subscriptionSchemas.getByExpiryDateRange },
    asyncWrapper(subscriptions.getByExpiryDateRange.bind(subscriptions)),
  );
  fastify.get(
    "/:subscription_id",
    { schema: subscriptionSchemas.getByID, preHandler: [parseIntParam("subscription_id")] },
    asyncWrapper(subscriptions.getBySubscriptionID.bind(subscriptions)),
  );
  fastify.put(
    "/:subscription_id",
    { schema: subscriptionSchemas.updateSubscription, preHandler: [parseIntParam("subscription_id")] },
    asyncWrapper(subscriptions.updateSubscription.bind(subscriptions)),
  );
  fastify.delete(
    "/:subscription_id",
    { schema: subscriptionSchemas.deleteSubscription, preHandler: [parseIntParam("subscription_id")] },
    asyncWrapper(subscriptions.deleteSubscription.bind(subscriptions)),
  );
}
