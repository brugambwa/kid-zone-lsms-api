import bcrypt from "bcryptjs";
import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import type {
  subcription_billing_frequency,
  subscription_link_active,
  subscription_status,
} from "@prisma/client";
import { prismaDBConn } from "../config/prisma";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/constants";
import { BadRequestError, HttpError } from "../utils/http.error";
import { BeneficiaryService } from "./beneficiaries.service";
import { SubscriptionService } from "./subscriptions.service";

const prismaAny = prismaDBConn as any;

type ParentJwtPayload = {
  sub: number;
  email: string;
  scope: "parent";
};

export type ParentCreateSubscriptionBeneficiaryInput = {
  beneficiary_first_name: string;
  beneficiary_last_name: string;
  beneficiary_date_of_birth: string;
  language_preference: string;
  subscription_link_active: subscription_link_active;
  no_of_books: number;
  fullfilment_frequency: string;
  fullfilment_start_date: string;
};

export type ParentCreateSubscriptionInput = {
  subcription_billing_frequency: subcription_billing_frequency;
  no_of_beneficiaries: number;
  subscription_status: subscription_status;
  beneficiaries: ParentCreateSubscriptionBeneficiaryInput[];
};

export class ParentService {
  private readonly beneficiaryService: BeneficiaryService;
  private readonly subscriptionService: SubscriptionService;

  constructor() {
    this.beneficiaryService = new BeneficiaryService();
    this.subscriptionService = new SubscriptionService();
  }

  private generateParentToken(subscriber_id: number, email: string): string {
    const payload: ParentJwtPayload = {
      sub: subscriber_id,
      email,
      scope: "parent",
    };
    const secret: Secret = JWT_SECRET as Secret;
    const options: SignOptions = {
      expiresIn: JWT_EXPIRES_IN as SignOptions["expiresIn"],
    };
    return jwt.sign(payload, secret, options);
  }

  private sanitizeSubscriber(row: Record<string, unknown>) {
    const { password_hash, ...rest } = row;
    return rest;
  }

  async signup(input: {
    first_name: string;
    last_name: string;
    telephone_number: string;
    email_address: string;
    village_id: number;
    home_address: string;
    password: string;
    confirm_password: string;
  }) {
    if (input.password !== input.confirm_password) {
      throw new BadRequestError("Password and confirm password do not match.");
    }
    if (input.password.length < 6) {
      throw new BadRequestError("Password must be at least 6 characters long.");
    }

    const existingEmail = (await prismaAny.subscribers.findUnique({
      where: { email_address: input.email_address },
    })) as { subscriber_id: number } | null;
    if (existingEmail) {
      throw new HttpError(409, "An account with this email already exists.");
    }

    const existingPhone = (await prismaAny.subscribers.findUnique({
      where: { telephone_number: input.telephone_number },
    })) as { subscriber_id: number } | null;
    if (existingPhone) {
      throw new HttpError(409, "An account with this phone number already exists.");
    }

    const password_hash = await bcrypt.hash(input.password, 10);

    const created = (await prismaAny.subscribers.create({
      data: {
        first_name: input.first_name,
        last_name: input.last_name,
        telephone_number: input.telephone_number,
        email_address: input.email_address,
        village_id: input.village_id,
        home_address: input.home_address,
        password_hash,
      },
    })) as Record<string, unknown>;

    const token = this.generateParentToken(created.subscriber_id as number, created.email_address as string);
    return {
      token,
      subscriber: this.sanitizeSubscriber(created),
    };
  }

  async listChildren(subscriber_id: number) {
    return prismaAny.subscriptionBeneficiaries.findMany({
      where: { subscriber_id },
      orderBy: { date_created: "desc" },
    });
  }

  async addChild(
    subscriber_id: number,
    input: {
      subscription_id: number;
      beneficiary_first_name: string;
      beneficiary_last_name: string;
      beneficiary_date_of_birth: string;
      language_preference: string;
      subscription_link_active: string;
      no_of_books: number;
      fullfilment_frequency: string;
      fullfilment_start_date: string;
    },
  ) {
    const subscription = (await prismaAny.subscriptions.findFirst({
      where: {
        subscription_id: input.subscription_id,
        subscriber_id,
      },
    })) as { subscription_id: number } | null;

    if (!subscription) {
      throw new HttpError(403, "Subscription not found or does not belong to your account.");
    }

    return this.beneficiaryService.createSubscriptionBeneficiary({
      subscription_id: input.subscription_id,
      subscriber_id,
      beneficiary_first_name: input.beneficiary_first_name,
      beneficiary_last_name: input.beneficiary_last_name,
      beneficiary_date_of_birth: input.beneficiary_date_of_birth,
      language_preference: input.language_preference,
      subscription_link_active: input.subscription_link_active,
      no_of_books: input.no_of_books,
      fullfilment_frequency: input.fullfilment_frequency,
      fullfilment_start_date: input.fullfilment_start_date,
    });
  }

  async assertBeneficiaryOwned(subscriber_id: number, beneficiary_id: number) {
    const row = (await prismaAny.subscriptionBeneficiaries.findFirst({
      where: { beneficiary_id, subscriber_id },
    })) as { beneficiary_id: number } | null;
    if (!row) {
      throw new HttpError(404, "Child not found.");
    }
  }

  async listOrdersForSubscriber(subscriber_id: number, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prismaAny.subscriberOrders.findMany({
        where: { subscriber_id },
        include: { orderFulfillments: true },
        orderBy: { order_date: "desc" },
        skip,
        take: limit,
      }),
      prismaAny.subscriberOrders.count({ where: { subscriber_id } }),
    ]);
    return { data, total };
  }

  async listOrdersForChild(subscriber_id: number, beneficiary_id: number) {
    await this.assertBeneficiaryOwned(subscriber_id, beneficiary_id);
    return prismaAny.subscriberOrders.findMany({
      where: { subscriber_id, beneficiary_id },
      include: { orderFulfillments: true },
      orderBy: { order_date: "desc" },
    });
  }

  async createSubscription(subscriber_id: number, input: ParentCreateSubscriptionInput) {
    if (input.beneficiaries.length < 1) {
      throw new BadRequestError("At least one beneficiary is required.");
    }
    if (input.beneficiaries.length !== input.no_of_beneficiaries) {
      throw new BadRequestError("no_of_beneficiaries must match the number of entries in beneficiaries.");
    }
    return this.subscriptionService.createSubscription(
      subscriber_id,
      input.subcription_billing_frequency,
      input.no_of_beneficiaries,
      input.subscription_status,
      input.beneficiaries,
    );
  }

  async listSubscriptions(subscriber_id: number, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prismaAny.subscriptions.findMany({
        where: { subscriber_id },
        orderBy: { subcription_date: "desc" },
        skip,
        take: limit,
      }),
      prismaAny.subscriptions.count({ where: { subscriber_id } }),
    ]);
    return { data, total };
  }
}
