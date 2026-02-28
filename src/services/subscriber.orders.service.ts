import { order_status, SubscriberOrders } from "@prisma/client";
import { SubscriberOrdersImplementation } from "../repositories/implementations/subscriber.orders.implementation";

export class SubscriberOrdersService {
  private readonly subscriberOrdersRepository: SubscriberOrdersImplementation;

  constructor() {
    this.subscriberOrdersRepository = new SubscriberOrdersImplementation();
  }

  async getByOrderID(order_id: number): Promise<SubscriberOrders | null> {
    return await this.subscriberOrdersRepository.getByOrderID(order_id);
  }

  async getAll(page: number, limit: number): Promise<{ data: SubscriberOrders[]; total: number }> {
    return await this.subscriberOrdersRepository.getAll(page, limit);
  }

  async getBySubscriberID(
    subscriber_id: number,
    page: number,
    limit: number,
  ): Promise<{ data: SubscriberOrders[]; total: number }> {
    return await this.subscriberOrdersRepository.getBySubscriberID(subscriber_id, page, limit);
  }

  async getByBeneficiaryID(beneficiary_id: number): Promise<SubscriberOrders[]> {
    return await this.subscriberOrdersRepository.getByBeneficiaryID(beneficiary_id);
  }

  async getByStatus(
    order_status: order_status,
    page: number,
    limit: number,
  ): Promise<{ data: SubscriberOrders[]; total: number }> {
    return await this.subscriberOrdersRepository.getByStatus(order_status, page, limit);
  }
}
