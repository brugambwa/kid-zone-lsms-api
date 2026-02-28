import { Prisma, subscription_link_active, SubscriptionBeneficiaries } from "@prisma/client";
import { prismaDBConn } from "../config/prisma";
import { SubscriptionBeneficiariesImplementationRepository } from "../repositories/implementations/beneficiaries.implementation";

export class BeneficiaryService {
  private readonly beneficiaryRepository: SubscriptionBeneficiariesImplementationRepository;

  constructor() {
    this.beneficiaryRepository = new SubscriptionBeneficiariesImplementationRepository();
  }

  async createSubscriptionBeneficiary(subscriptionBeneficiary: any): Promise<SubscriptionBeneficiaries> {
    return await prismaDBConn.$transaction(async (tx) => {
      const createBeneficiaryObj = {
        subscription_id: subscriptionBeneficiary.subscription_id,
        subscriber_id: subscriptionBeneficiary.subscriber_id,
        beneficiary_first_name: subscriptionBeneficiary.beneficiary_first_name,
        beneficiary_last_name: subscriptionBeneficiary.beneficiary_last_name,
        language_preference: subscriptionBeneficiary.language_preference,
        subscription_link_active: subscriptionBeneficiary.subscription_link_active,
        beneficiary_date_of_birth: new Date(subscriptionBeneficiary.beneficiary_date_of_birth).toISOString(),
      } as Prisma.SubscriptionBeneficiariesUncheckedCreateInput;

      const newBeneficiary = await tx.subscriptionBeneficiaries.create({ data: createBeneficiaryObj }); // Ensure this runs within the transaction

      const beneficiaryOrderObj = {
        subscription_id: subscriptionBeneficiary.subscription_id,
        subscriber_id: subscriptionBeneficiary.subscriber_id,
        beneficiary_id: newBeneficiary.beneficiary_id, // This will be set after the beneficiary is created
        no_of_books: subscriptionBeneficiary.no_of_books,
        fullfilment_frequency: subscriptionBeneficiary.fullfilment_frequency,
        fullfilment_start_date: new Date(subscriptionBeneficiary.fullfilment_start_date).toISOString(),
        next_fulfilment_date: this.getNextFulfilmentDate(
          subscriptionBeneficiary.fullfilment_start_date,
          subscriptionBeneficiary.fullfilment_frequency,
        ),
        order_status: "active", // Assuming new orders are active by default
      } as Prisma.SubscriberOrdersUncheckedCreateInput;
      await tx.subscriberOrders.create({ data: beneficiaryOrderObj }); // Ensure this runs within the transaction

      return newBeneficiary;
    });
  }

  async getAllBeneficiaries(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: SubscriptionBeneficiaries[]; total: number }> {
    return await this.beneficiaryRepository.getAllBeneficiaries(page, limit);
  }

  async getByBeneficiaryID(beneficiary_id: number): Promise<SubscriptionBeneficiaries[]> {
    return await this.beneficiaryRepository.getByBeneficiaryID(beneficiary_id);
  }

  async getBySubcriberID(subscriber_id: number): Promise<SubscriptionBeneficiaries[]> {
    return await this.beneficiaryRepository.getBySubcriberID(subscriber_id);
  }

  async getBySubscriptionID(subscription_id: number): Promise<SubscriptionBeneficiaries[]> {
    return await this.beneficiaryRepository.getBySubscriptionID(subscription_id);
  }

  async getByLinkStatus(
    subscription_link_active: subscription_link_active,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: SubscriptionBeneficiaries[]; total: number }> {
    return await this.beneficiaryRepository.getByLinkStatus(subscription_link_active, page, limit);
  }

  async updateSubscriptionBeneficiary(
    beneficiary_id: number,
    updateData: Prisma.SubscriptionBeneficiariesUncheckedUpdateInput,
  ): Promise<SubscriptionBeneficiaries | null> {
    return await this.beneficiaryRepository.updateSubscriptionBeneficiary(beneficiary_id, updateData);
  }

  async deleteSubscriptionBeneficiary(beneficiary_id: number): Promise<void> {
    return await this.beneficiaryRepository.deleteSubscriptionBeneficiary(beneficiary_id);
  }

  getNextFulfilmentDate = (startDate: string, frequency: string): string =>
    new Date(
      new Date(startDate).setDate(new Date(startDate).getDate() + (frequency === "weekly" ? 7 : 14)),
    ).toISOString();
}
