import { SubscriberOrders } from "@prisma/client";

export interface SubscriberOrdersRepository {
  createSubscriberOrder(
    subscriberOrder: Omit<SubscriberOrders, "id" | "createdAt" | "updatedAt">,
  ): Promise<SubscriberOrders>;
  getByOrderID(order_id: number): Promise<SubscriberOrders | null>;
  getAll(page: number, limit: number): Promise<{ data: SubscriberOrders[]; total: number }>;
  getBySubscriberID(
    subscriber_id: number,
    page: number,
    limit: number,
  ): Promise<{ data: SubscriberOrders[]; total: number }>;
  getByBeneficiaryID(beneficiary_id: number): Promise<SubscriberOrders[]>;
  getByStatus(
    status: string,
    page: number,
    limit: number,
  ): Promise<{ data: SubscriberOrders[]; total: number }>;
}
