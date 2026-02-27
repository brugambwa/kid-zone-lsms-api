import { FastifyInstance } from "fastify";
import { beneficiariesRoutes } from "./beneficiaries.route";
import { subscriberRoutes } from "./subscriber.route";
import { subscriptionsRoutes } from "./subscriptions.route";

export async function kidzoneLMSRoutes(fastify: FastifyInstance) {
  fastify.register(beneficiariesRoutes, { prefix: "/beneficiaries" });
  fastify.register(subscriberRoutes, { prefix: "/subscribers" });
  fastify.register(subscriptionsRoutes, { prefix: "/subscriptions" });
}
