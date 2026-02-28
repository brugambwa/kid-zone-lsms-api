import { SubscriberOrders, Prisma, order_status } from "@prisma/client";
import { prismaDBConn } from "../../config/prisma";
import { SubscriberOrdersRepository } from "../interfaces/susbcriber.orders.interface";

export class SubscriberOrdersImplementation implements SubscriberOrdersRepository {
  async createSubscriberOrder(
    subscriberOrder: Prisma.SubscriberOrdersUncheckedCreateInput,
  ): Promise<SubscriberOrders> {
    return await prismaDBConn.subscriberOrders.create({ data: subscriberOrder });
  }

  async getByOrderID(order_id: number): Promise<SubscriberOrders | null> {
    return await prismaDBConn.subscriberOrders.findUnique({ where: { order_id } });
  }

  async getAll(page: number, limit: number): Promise<{ data: SubscriberOrders[]; total: number }> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prismaDBConn.subscriberOrders.findMany({ skip, take: limit }),
      prismaDBConn.subscriberOrders.count(),
    ]);
    return { data, total };
  }

  async getBySubscriberID(
    subscriber_id: number,
    page: number,
    limit: number,
  ): Promise<{ data: SubscriberOrders[]; total: number }> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prismaDBConn.subscriberOrders.findMany({ where: { subscriber_id }, skip, take: limit }),
      prismaDBConn.subscriberOrders.count({ where: { subscriber_id } }),
    ]);
    return { data, total };
  }

  async getByBeneficiaryID(beneficiary_id: number): Promise<SubscriberOrders[]> {
    return await prismaDBConn.subscriberOrders.findMany({ where: { beneficiary_id } });
  }

  async getByStatus(
    order_status: order_status,
    page: number,
    limit: number,
  ): Promise<{ data: SubscriberOrders[]; total: number }> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prismaDBConn.subscriberOrders.findMany({ where: { order_status }, skip, take: limit }),
      prismaDBConn.subscriberOrders.count({ where: { order_status } }),
    ]);
    return { data, total };
  }
}
