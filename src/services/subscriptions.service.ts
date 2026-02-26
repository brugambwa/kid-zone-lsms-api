import { subscription_status, Subscriptions, subcription_billing_frequency, Prisma } from "@prisma/client";
import { SubscriptionImplementationRepository } from "../repositories/implementations/subscriptions.implementation";

export class SubscriptionService {
  private readonly subscriptionRepository: SubscriptionImplementationRepository;

  constructor() {
    this.subscriptionRepository = new SubscriptionImplementationRepository();
  }

  async createSubscription(
    subscriber_id: number,
    subcription_billing_frequency: subcription_billing_frequency,
    no_of_beneficiaries: number,
    subscription_status: subscription_status,
  ): Promise<Subscriptions> {
    const subscriptionData = {
      subscriber_id,
      subcription_billing_frequency,
      no_of_beneficiaries,
      subscription_status,
    } as Prisma.SubscriptionsUncheckedCreateInput;
    return await this.subscriptionRepository.createSubscription(subscriptionData);
  }

  async getAllSubscriptions(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Subscriptions[]; total: number }> {
    return await this.subscriptionRepository.getAll(page, limit);
  }

  async getSubscriptionByID(subscription_id: number): Promise<Subscriptions | null> {
    return await this.subscriptionRepository.getByID(subscription_id);
  }

  async getSubscriptionsBySubscriberID(
    subscriber_id: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<Subscriptions[]> {
    return await this.subscriptionRepository.getBySubscriberID(subscriber_id, page, limit);
  }

  async getByStatus(
    status: subscription_status,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Subscriptions[]; total: number }> {
    return await this.subscriptionRepository.getByStatus(status, page, limit);
  }

  async getByFrequency(
    frequency: subcription_billing_frequency,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Subscriptions[]; total: number }> {
    return await this.subscriptionRepository.getByFrequency(frequency, page, limit);
  }

  async getByExpiryDateRange(
    start_date: Date,
    end_date: Date,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Subscriptions[]; total: number }> {
    return await this.subscriptionRepository.getByExpiryDateRange(start_date, end_date, page, limit);
  }

  async updateSubscription(
    subscription_id: number,
    subcription_billing_frequency?: subcription_billing_frequency,
    no_of_beneficiaries?: number,
    subscription_status?: subscription_status,
  ): Promise<Subscriptions> {
    return await this.subscriptionRepository.updateSubscription(subscription_id, {
      subcription_billing_frequency,
      no_of_beneficiaries,
      subscription_status,
    });
  }

  async deleteSubscription(subscription_id: number): Promise<void> {
    await this.subscriptionRepository.deleteSubscription(subscription_id);
  }
}
