import { Prisma, subscription_link_active, SubscriptionBeneficiaries } from "@prisma/client";
import { prismaDBConn } from "../../config/prisma";
import { SubscriptionBeneficiariesRepository } from "../interfaces/subscription.beneficiaries.interface";

export class SubscriptionBeneficiariesImplementationRepository implements SubscriptionBeneficiariesRepository {
  async createSubscriptionBeneficiary(
    subscriptionBeneficiary: Prisma.SubscriptionBeneficiariesUncheckedCreateInput,
  ): Promise<SubscriptionBeneficiaries> {
    return await prismaDBConn.subscriptionBeneficiaries.create({ data: subscriptionBeneficiary });
  }

  async getAllBeneficiaries(
    page: number,
    limit: number,
  ): Promise<{ data: SubscriptionBeneficiaries[]; total: number }> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prismaDBConn.subscriptionBeneficiaries.findMany({ skip, take: limit }),
      prismaDBConn.subscriptionBeneficiaries.count(),
    ]);
    return { data, total };
  }

  async getByBeneficiaryID(beneficiary_id: number): Promise<SubscriptionBeneficiaries[]> {
    return await prismaDBConn.subscriptionBeneficiaries.findMany({
      where: { beneficiary_id },
    });
  }

  async getBySubcriberID(subscriber_id: number): Promise<SubscriptionBeneficiaries[]> {
    return await prismaDBConn.subscriptionBeneficiaries.findMany({
      where: { subscriber_id },
    });
  }

  async getBySubscriptionID(subscription_id: number): Promise<SubscriptionBeneficiaries[]> {
    return await prismaDBConn.subscriptionBeneficiaries.findMany({
      where: { subscription_id },
    });
  }

  async getByLinkStatus(
    subscription_link_active: subscription_link_active,
    page: number,
    limit: number,
  ): Promise<{ data: SubscriptionBeneficiaries[]; total: number }> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prismaDBConn.subscriptionBeneficiaries.findMany({
        where: { subscription_link_active },
        skip,
        take: limit,
      }),
      prismaDBConn.subscriptionBeneficiaries.count({ where: { subscription_link_active } }),
    ]);
    return { data, total };
  }

  async updateSubscriptionBeneficiary(
    beneficiary_id: number,
    subscriptionBeneficiary: Prisma.SubscriptionBeneficiariesUncheckedUpdateInput,
  ): Promise<SubscriptionBeneficiaries> {
    return await prismaDBConn.subscriptionBeneficiaries.update({
      where: { beneficiary_id },
      data: subscriptionBeneficiary,
    });
  }

  async deleteSubscriptionBeneficiary(beneficiary_id: number): Promise<void> {
    await prismaDBConn.subscriptionBeneficiaries.delete({ where: { beneficiary_id } });
  }
}
