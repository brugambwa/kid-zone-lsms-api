import { OrderFulfillments, Prisma } from "@prisma/client";

export interface OrderFulfillmentsInterfaceRepo {
  createOrderFulfillment(
    orderFulfillment: Prisma.OrderFulfillmentsUncheckedCreateInput,
  ): Promise<OrderFulfillments>;
  getByID(fulfillment_id: number): Promise<OrderFulfillments | null>;
  getAll(page: number, limit: number): Promise<{ data: OrderFulfillments[]; total: number }>;
  getByOrderID(
    order_id: number,
    page: number,
    limit: number,
  ): Promise<{ data: OrderFulfillments[]; total: number }>;
  getByStatus(
    status: string,
    page: number,
    limit: number,
  ): Promise<{ data: OrderFulfillments[]; total: number }>;
  getByFulfillmentDateRange(
    startDate: Date,
    endDate: Date,
    page: number,
    limit: number,
  ): Promise<{ data: OrderFulfillments[]; total: number }>;
  getByExpectedReturnDateRange(
    startDate: Date,
    endDate: Date,
    page: number,
    limit: number,
  ): Promise<{ data: OrderFulfillments[]; total: number }>;
  updateOrderFulfillment(
    fulfillment_id: number,
    orderFulfillment: Prisma.OrderFulfillmentsUpdateInput,
  ): Promise<OrderFulfillments>;
  deleteOrderFulfillment(fulfillment_id: number): Promise<void>;
}
