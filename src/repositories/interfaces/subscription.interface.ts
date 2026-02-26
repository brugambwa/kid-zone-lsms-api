import { Subscriptions, Prisma } from "@prisma/client";

export interface SubscriptionInterfaceRepository {
  createSubscription(subscription: Prisma.SubscriptionsUncheckedCreateInput): Promise<Subscriptions>;
  getByID(id: number): Promise<Subscriptions | null>;
  getAll(page: number, limit: number): Promise<{ data: Subscriptions[]; total: number }>;
  getBySubscriberID(subscriber_id: number, page: number, limit: number): Promise<Subscriptions[]>;
  getByStatus(status: string, page: number, limit: number): Promise<{ data: Subscriptions[]; total: number }>;
  getByFrequency(
    frequency: string,
    page: number,
    limit: number,
  ): Promise<{ data: Subscriptions[]; total: number }>;
  getByExpiryDateRange(
    start_date: Date,
    end_date: Date,
    page: number,
    limit: number,
  ): Promise<{ data: Subscriptions[]; total: number }>;
  updateSubscription(
    id: number,
    subscription: Partial<Omit<Subscriptions, "id" | "createdAt" | "updatedAt">>,
  ): Promise<Subscriptions>;
  deleteSubscription(id: number): Promise<void>;
}
