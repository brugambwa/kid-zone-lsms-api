import { fulfillment_status, OrderFulfillments, Prisma } from "@prisma/client";
import { prismaDBConn } from "../../config/prisma";
import { OrderFulfillmentsInterfaceRepo } from "../interfaces/order.fulfillment.interface";

export class OrderFulfillmentsImplementation implements OrderFulfillmentsInterfaceRepo {
  async createOrderFulfillment(
    orderFulfillment: Prisma.OrderFulfillmentsUncheckedCreateInput,
  ): Promise<OrderFulfillments> {
    return await prismaDBConn.orderFulfillments.create({ data: orderFulfillment });
  }

  async getByID(fulfillment_id: number): Promise<OrderFulfillments | null> {
    return await prismaDBConn.orderFulfillments.findUnique({ where: { fulfillment_id } });
  }

  async getAll(page: number, limit: number): Promise<{ data: OrderFulfillments[]; total: number }> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prismaDBConn.orderFulfillments.findMany({ skip, take: limit }),
      prismaDBConn.orderFulfillments.count(),
    ]);
    return { data, total };
  }

  async getByOrderID(
    order_id: number,
    page: number,
    limit: number,
  ): Promise<{ data: OrderFulfillments[]; total: number }> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prismaDBConn.orderFulfillments.findMany({ where: { order_id }, skip, take: limit }),
      prismaDBConn.orderFulfillments.count({ where: { order_id } }),
    ]);
    return { data, total };
  }

  async getByStatus(
    fulfillment_status: fulfillment_status,
    page: number,
    limit: number,
  ): Promise<{ data: OrderFulfillments[]; total: number }> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prismaDBConn.orderFulfillments.findMany({ where: { fulfillment_status }, skip, take: limit }),
      prismaDBConn.orderFulfillments.count({ where: { fulfillment_status } }),
    ]);
    return { data, total };
  }

  async getByFulfillmentDateRange(
    startDate: Date,
    endDate: Date,
    page: number,
    limit: number,
  ): Promise<{ data: OrderFulfillments[]; total: number }> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prismaDBConn.orderFulfillments.findMany({
        where: { fulfillment_date: { gte: startDate, lte: endDate } },
        skip,
        take: limit,
      }),
      prismaDBConn.orderFulfillments.count({
        where: { fulfillment_date: { gte: startDate, lte: endDate } },
      }),
    ]);
    return { data, total };
  }

  async getByExpectedReturnDateRange(
    startDate: Date,
    endDate: Date,
    page: number,
    limit: number,
  ): Promise<{ data: OrderFulfillments[]; total: number }> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prismaDBConn.orderFulfillments.findMany({
        where: { expected_return_date: { gte: startDate, lte: endDate } },
        skip,
        take: limit,
      }),
      prismaDBConn.orderFulfillments.count({
        where: { expected_return_date: { gte: startDate, lte: endDate } },
      }),
    ]);
    return { data, total };
  }

  async updateOrderFulfillment(
    fulfillment_id: number,
    orderFulfillment: Prisma.OrderFulfillmentsUpdateInput,
  ): Promise<OrderFulfillments> {
    return await prismaDBConn.orderFulfillments.update({
      where: { fulfillment_id },
      data: orderFulfillment,
    });
  }

  async deleteOrderFulfillment(fulfillment_id: number): Promise<void> {
    await prismaDBConn.orderFulfillments.delete({ where: { fulfillment_id } });
  }
}
