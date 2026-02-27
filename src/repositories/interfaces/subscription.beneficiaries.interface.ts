import { SubscriptionBeneficiaries, Prisma, subscription_link_active } from "@prisma/client";

export interface SubscriptionBeneficiariesRepository {
  createSubscriptionBeneficiary(
    subscriptionBeneficiary: Prisma.SubscriptionBeneficiariesUncheckedCreateInput,
  ): Promise<SubscriptionBeneficiaries>;
  getAllBeneficiaries(
    page: number,
    limit: number,
  ): Promise<{ data: SubscriptionBeneficiaries[]; total: number }>;
  getByBeneficiaryID(beneficiary_id: number): Promise<SubscriptionBeneficiaries[]>;
  getBySubcriberID(subscriber_id: number): Promise<SubscriptionBeneficiaries[]>;
  getBySubscriptionID(subscription_id: number): Promise<SubscriptionBeneficiaries[]>;
  getByLinkStatus(
    subscription_link_active: subscription_link_active,
    page: number,
    limit: number,
  ): Promise<{ data: SubscriptionBeneficiaries[]; total: number }>;
  updateSubscriptionBeneficiary(
    id: number,
    subscriptionBeneficiary: Prisma.SubscriptionBeneficiariesUncheckedUpdateInput,
  ): Promise<SubscriptionBeneficiaries>;
  deleteSubscriptionBeneficiary(id: number): Promise<void>;
}
