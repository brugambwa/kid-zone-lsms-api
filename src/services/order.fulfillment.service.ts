import { fulfillment_status, OrderFulfillments, Prisma } from "@prisma/client";
import { OrderFulfillmentsImplementation } from "../repositories/implementations/order.fulfillment.implementation";
import { prismaDBConn } from "../config/prisma";

export class OrderFulfillmentService {
  private readonly orderFulfillmentRepository: OrderFulfillmentsImplementation;

  constructor() {
    this.orderFulfillmentRepository = new OrderFulfillmentsImplementation();
  }

  async createOrderFulfillment(
    beneficiary_id: number,
    order_id: number,
    notes: string,
    fulfillment_status: fulfillment_status,
    fulfillment_date: Date,
    expected_return_date: Date,
    fulfillment_items: any[],
  ): Promise<OrderFulfillments> {
    return await prismaDBConn.$transaction(async (tx) => {
      const orderFulfillmentData: Prisma.OrderFulfillmentsUncheckedCreateInput = {
        order_id: order_id,
        notes: notes,
        fulfillment_status,
        fulfillment_date,
        expected_return_date,
      };

      const newOrderFulfillment = await tx.orderFulfillments.create({
        data: orderFulfillmentData,
      });

      const fulfillmentItemsData: Prisma.FulfillmentItemsUncheckedCreateInput[] = fulfillment_items.map(
        (item) => ({
          fulfillment_id: newOrderFulfillment.fulfillment_id,
          beneficiary_id: beneficiary_id,
          book_id: item.book_id,
        }),
      );

      await tx.fulfillmentItems.createMany({
        data: fulfillmentItemsData,
      });

      return newOrderFulfillment;
    });
  }

  async getByID(fulfillment_id: number): Promise<OrderFulfillments | null> {
    return await this.orderFulfillmentRepository.getByID(fulfillment_id);
  }

  async getAll(page: number = 1, limit: number = 10): Promise<{ data: OrderFulfillments[]; total: number }> {
    return await this.orderFulfillmentRepository.getAll(page, limit);
  }

  async getByOrderID(
    order_id: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: OrderFulfillments[]; total: number }> {
    return await this.orderFulfillmentRepository.getByOrderID(order_id, page, limit);
  }

  async getByStatus(
    fulfillment_status: fulfillment_status,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: OrderFulfillments[]; total: number }> {
    return await this.orderFulfillmentRepository.getByStatus(fulfillment_status, page, limit);
  }

  async getByFulfillmentDateRange(
    startDate: Date,
    endDate: Date,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: OrderFulfillments[]; total: number }> {
    return await this.orderFulfillmentRepository.getByFulfillmentDateRange(startDate, endDate, page, limit);
  }

  async getByExpectedReturnDateRange(
    startDate: Date,
    endDate: Date,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: OrderFulfillments[]; total: number }> {
    return await this.orderFulfillmentRepository.getByExpectedReturnDateRange(
      startDate,
      endDate,
      page,
      limit,
    );
  }

  async updateOrderFulfillment(
    fulfillment_id: number,
    fulfillment_status?: fulfillment_status,
  ): Promise<OrderFulfillments> {
    return await this.orderFulfillmentRepository.updateOrderFulfillment(fulfillment_id, {
      fulfillment_status,
    });
  }

  async deleteOrderFulfillment(fulfillment_id: number): Promise<void> {
    await this.orderFulfillmentRepository.deleteOrderFulfillment(fulfillment_id);
  }

  async autoCreteFulfillmentOrders(): Promise<void> {
    //await this.orderFulfillmentRepository.autoCreateFulfillmentOrders();
  }
}
