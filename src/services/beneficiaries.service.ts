import { Prisma, subscription_link_active, SubscriptionBeneficiaries } from "@prisma/client";
import { SubscriptionBeneficiariesImplementationRepository } from "../repositories/implementations/beneficiaries.implementation";

export class BeneficiaryService {
  private readonly beneficiaryRepository: SubscriptionBeneficiariesImplementationRepository;

  constructor() {
    this.beneficiaryRepository = new SubscriptionBeneficiariesImplementationRepository();
  }

  async createSubscriptionBeneficiary(
    subscriptionBeneficiary: Prisma.SubscriptionBeneficiariesUncheckedCreateInput,
  ): Promise<SubscriptionBeneficiaries> {
    return await this.beneficiaryRepository.createSubscriptionBeneficiary(subscriptionBeneficiary);
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
}
