import { SubscriptionBeneficiaries } from "@prisma/client";

export interface SubscriptionBeneficiariesRepository {
  createSubscriptionBeneficiary(
    subscriptionBeneficiary: Omit<SubscriptionBeneficiaries, "id" | "createdAt" | "updatedAt">,
  ): Promise<SubscriptionBeneficiaries>;
  getBySubscriptionID(
    subscription_id: number,
    page: number,
    limit: number,
  ): Promise<SubscriptionBeneficiaries[]>;
  getBySubcriberID(subscriber_id: number, page: number, limit: number): Promise<SubscriptionBeneficiaries[]>;
  getByBeneficiaryID(beneficiary_id: number): Promise<SubscriptionBeneficiaries[]>;
  updateSubscriptionBeneficiary(
    id: number,
    subscriptionBeneficiary: Partial<Omit<SubscriptionBeneficiaries, "id" | "createdAt" | "updatedAt">>,
  ): Promise<SubscriptionBeneficiaries>;
  deleteSubscriptionBeneficiary(id: number): Promise<void>;
}
