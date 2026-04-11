import { FastifyInstance } from "fastify";
import { beneficiariesRoutes } from "./beneficiaries.route";
import { booksInventoryRoutes } from "./books.inventory.route";
import { orderFulfillmentRoutes } from "./order.fulfillment.route";
import { subscriberOrdersRoutes } from "./subscriber.orders.route";
import { subscriberRoutes } from "./subscriber.route";
import { subscriptionsRoutes } from "./subscriptions.route";
import { authRoutes } from "./auth.route";
import { adminsRoutes } from "./admins.route";
import { parentRoutes } from "./parent.route";

export async function kidzoneLMSRoutes(fastify: FastifyInstance) {
  fastify.register(authRoutes, { prefix: "/auth" });
  fastify.register(parentRoutes, { prefix: "/parent" });
  fastify.register(adminsRoutes, { prefix: "/admins" });
  fastify.register(beneficiariesRoutes, { prefix: "/beneficiaries" });
  fastify.register(booksInventoryRoutes, { prefix: "/books" });
  fastify.register(orderFulfillmentRoutes, { prefix: "/fulfillments" });
  fastify.register(subscriberOrdersRoutes, { prefix: "/orders" });
  fastify.register(subscriberRoutes, { prefix: "/subscribers" });
  fastify.register(subscriptionsRoutes, { prefix: "/subscriptions" });
}


