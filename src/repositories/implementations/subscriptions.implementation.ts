import { Subscriptions, Prisma, subscription_status, subcription_billing_frequency } from "@prisma/client";
import { prismaDBConn } from "../../config/prisma";
import { SubscriptionInterfaceRepository } from "../interfaces/subscription.interface";

export class SubscriptionImplementationRepository implements SubscriptionInterfaceRepository {
  async createSubscription(subscription: Prisma.SubscriptionsUncheckedCreateInput): Promise<Subscriptions> {
    return await prismaDBConn.subscriptions.create({ data: subscription });
  }

  async getByID(subscription_id: number): Promise<Subscriptions | null> {
    return await prismaDBConn.subscriptions.findUnique({ where: { subscription_id } });
  }

  async getAll(page: number, limit: number): Promise<{ data: Subscriptions[]; total: number }> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prismaDBConn.subscriptions.findMany({ skip, take: limit }),
      prismaDBConn.subscriptions.count(),
    ]);
    return { data, total };
  }

  async getBySubscriberID(subscriber_id: number, page: number, limit: number): Promise<Subscriptions[]> {
    const skip = (page - 1) * limit;
    return await prismaDBConn.subscriptions.findMany({
      where: { subscriber_id },
      skip,
      take: limit,
    });
  }

  async getByStatus(
    subscription_status: subscription_status,
    page: number,
    limit: number,
  ): Promise<{ data: Subscriptions[]; total: number }> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prismaDBConn.subscriptions.findMany({ where: { subscription_status }, skip, take: limit }),
      prismaDBConn.subscriptions.count({ where: { subscription_status } }),
    ]);
    return { data, total };
  }

  async getByFrequency(
    subcription_billing_frequency: subcription_billing_frequency,
    page: number,
    limit: number,
  ): Promise<{ data: Subscriptions[]; total: number }> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prismaDBConn.subscriptions.findMany({ where: { subcription_billing_frequency }, skip, take: limit }),
      prismaDBConn.subscriptions.count({ where: { subcription_billing_frequency } }),
    ]);
    return { data, total };
  }

  async getByExpiryDateRange(
    start_date: Date,
    end_date: Date,
    page: number,
    limit: number,
  ): Promise<{ data: Subscriptions[]; total: number }> {
    const skip = (page - 1) * limit;

    const where = {
      subscription_expiry_date: {
        gte: start_date,
        lte: end_date,
      },
    };

    const [data, total] = await Promise.all([
      prismaDBConn.subscriptions.findMany({ where, skip, take: limit }),
      prismaDBConn.subscriptions.count({ where }),
    ]);

    return { data, total };
  }

  async updateSubscription(
    subscription_id: number,
    subscription: Prisma.SubscriptionsUncheckedUpdateInput,
  ): Promise<Subscriptions> {
    return await prismaDBConn.subscriptions.update({
      where: { subscription_id },
      data: subscription,
    });
  }

  async deleteSubscription(subscription_id: number): Promise<void> {
    await prismaDBConn.subscriptions.delete({ where: { subscription_id } });
  }
}
