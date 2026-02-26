import { OrderFulfillments } from "@prisma/client";

export interface OrderFulfillmentsRepository {
  createOrderFulfillment(
    orderFulfillment: Omit<OrderFulfillments, "id" | "createdAt" | "updatedAt">,
  ): Promise<OrderFulfillments>;
  getByOrderId(orderId: number): Promise<OrderFulfillments[]>;
  getByStatus(status: string): Promise<OrderFulfillments[]>;
}
