import {
  subscription_status,
  Subscriptions,
  subcription_billing_frequency,
  Prisma,
  subscription_link_active,
} from "@prisma/client";
import { SubscriptionImplementationRepository } from "../repositories/implementations/subscriptions.implementation";
import { SubscriptionBeneficiariesImplementationRepository } from "../repositories/implementations/beneficiaries.implementation";
import { prismaDBConn } from "../config/prisma";

export class SubscriptionService {
  private readonly subscriptionRepository: SubscriptionImplementationRepository;
  private readonly beneficiariesRepository: SubscriptionBeneficiariesImplementationRepository;

  constructor() {
    this.subscriptionRepository = new SubscriptionImplementationRepository();
    this.beneficiariesRepository = new SubscriptionBeneficiariesImplementationRepository();
  }

  async createSubscription(
    subscriber_id: number,
    subcription_billing_frequency: subcription_billing_frequency,
    no_of_beneficiaries: number,
    subscription_status: subscription_status,
    beneficiaries: {
      beneficiary_first_name: string;
      beneficiary_last_name: string;
      beneficiary_date_of_birth: string;
      language_preference: string;
      subscription_link_active: subscription_link_active;
      no_of_books: number;
      fullfilment_frequency: string;
      fullfilment_start_date: string;
    }[],
  ): Promise<Subscriptions> {
    return await prismaDBConn.$transaction(async (tx) => {
      const subscriptionData = {
        subscriber_id,
        subcription_billing_frequency,
        no_of_beneficiaries,
        subscription_expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        subscription_status,
      } as Prisma.SubscriptionsUncheckedCreateInput;

      const newSubscription = await tx.subscriptions.create({
        data: subscriptionData,
      });

      const beneficiariesData: Prisma.SubscriptionBeneficiariesUncheckedCreateInput[] = beneficiaries.map(
        (beneficiary) => ({
          beneficiary_first_name: beneficiary.beneficiary_first_name,
          beneficiary_last_name: beneficiary.beneficiary_last_name,
          language_preference: beneficiary.language_preference,
          subscription_link_active: beneficiary.subscription_link_active,
          beneficiary_date_of_birth: new Date(beneficiary.beneficiary_date_of_birth).toISOString(),
          subscriber_id,
          subscription_id: newSubscription.subscription_id,
        }),
      );

      const newBeneficiaries = await Promise.all(
        beneficiariesData.map((data) =>
          tx.subscriptionBeneficiaries.create({ data, select: { beneficiary_id: true } }),
        ),
      );

      const beneficiariesOrderData: Prisma.SubscriberOrdersUncheckedCreateInput[] = beneficiaries.map(
        (beneficiary, index) => ({
          subscriber_id,
          beneficiary_id: newBeneficiaries[index].beneficiary_id,
          subscription_id: newSubscription.subscription_id,
          no_of_books: beneficiary.no_of_books,
          fullfilment_frequency: beneficiary.fullfilment_frequency as any,
          fullfilment_start_date: new Date(beneficiary.fullfilment_start_date).toISOString(),
          next_fulfilment_date: new Date(beneficiary.fullfilment_start_date).toISOString(),
          order_status: "active",
        }),
      );

      await tx.subscriberOrders.createMany({
        data: beneficiariesOrderData,
      });

      return newSubscription;
    });
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
