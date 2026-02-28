import { FastifyReply, FastifyRequest } from "fastify";
import { ResponseHandler } from "../utils/response";
import { logger } from "../utils/logger";
import { PaginationHandler } from "../utils/pagination.handler";
import { SubscriptionService } from "../services/subscriptions.service";

export class SubscriptionsController {
  private readonly subscriptionService: SubscriptionService;

  constructor() {
    this.subscriptionService = new SubscriptionService();
  }

  async createSubscription(request: FastifyRequest, reply: FastifyReply) {
    const {
      subscriber_id,
      subcription_billing_frequency,
      no_of_beneficiaries,
      subscription_status,
      beneficiaries,
    } = request.body as {
      subscriber_id: number;
      subcription_billing_frequency: string;
      no_of_beneficiaries: number;
      subscription_status: string;
      beneficiaries: {
        beneficiary_first_name: string;
        beneficiary_last_name: string;
        beneficiary_date_of_birth: string;
        language_preference: string;
        subscription_link_active: boolean;
        no_of_books: number;
        fullfilment_frequency: string;
        fullfilment_start_date: string;
      }[];
    };

    const newSubscription = await this.subscriptionService.createSubscription(
      subscriber_id,
      subcription_billing_frequency as any,
      no_of_beneficiaries,
      subscription_status as any,
      beneficiaries as any,
    );
    logger.info(`Subscriber created successfully with ID ${newSubscription.subscription_id}.`);
    return ResponseHandler.success(reply, newSubscription, 100, "Subscription created successfully", 201);
  }

  async getAllSubscriptions(request: FastifyRequest, reply: FastifyReply) {
    return PaginationHandler.handlePaginatedRequest(
      request,
      reply,
      (page: number, limit: number) => this.subscriptionService.getAllSubscriptions(page, limit),
      {
        notFound: "No subscription records found.",
        notFoundLog: "No subscription records found.",
        success: "Subscription records retrieved successfully.",
        successLog: "Subscription records retrieved successfully.",
      },
    );
  }

  async getBySubscriptionID(request: FastifyRequest, reply: FastifyReply) {
    const { subscription_id } = request.params as { subscription_id: number };
    const subscription = await this.subscriptionService.getSubscriptionByID(subscription_id);
    if (!subscription) {
      logger.warn(`Subscription with ID ${subscription_id} not found.`);
      return ResponseHandler.error(reply, `Subscription with ID ${subscription_id} not found.`, 101, 200);
    }
    logger.info(`Subscription with ID ${subscription_id} retrieved successfully.`);
    return ResponseHandler.success(reply, subscription, 100, "Subscription retrieved successfully.");
  }

  async getBySubscriberID(request: FastifyRequest, reply: FastifyReply) {
    const { subscriber_id } = request.params as { subscriber_id: number };
    const subscriber = await this.subscriptionService.getSubscriptionsBySubscriberID(subscriber_id);
    if (!subscriber) {
      logger.warn(`Subscriber with ID ${subscriber_id} not found.`);
      return ResponseHandler.error(reply, `Subscriber with ID ${subscriber_id} not found.`, 101, 200);
    }
    logger.info(`Subscriber with ID ${subscriber_id} retrieved successfully.`);
    return ResponseHandler.success(reply, subscriber, 100, "Subscriber retrieved successfully.");
  }

  async getByStatus(request: FastifyRequest, reply: FastifyReply) {
    const { status } = request.params as { status: string };
    return PaginationHandler.handlePaginatedRequest(
      request,
      reply,
      (page: number, limit: number) => this.subscriptionService.getByStatus(status as any, page, limit),
      {
        notFound: `No subscriptions found with status ${status}.`,
        notFoundLog: `No subscriptions found with status ${status}.`,
        success: `Subscriptions with status ${status} retrieved successfully.`,
        successLog: `Subscriptions with status ${status} retrieved successfully.`,
      },
    );
  }

  async getByFrequency(request: FastifyRequest, reply: FastifyReply) {
    const { frequency } = request.params as { frequency: string };
    return PaginationHandler.handlePaginatedRequest(
      request,
      reply,
      (page: number, limit: number) => this.subscriptionService.getByFrequency(frequency as any, page, limit),
      {
        notFound: `No subscriptions found with frequency ${frequency}.`,
        notFoundLog: `No subscriptions found with frequency ${frequency}.`,
        success: `Subscriptions with frequency ${frequency} retrieved successfully.`,
        successLog: `Subscriptions with frequency ${frequency} retrieved successfully.`,
      },
    );
  }

  async getByExpiryDateRange(request: FastifyRequest, reply: FastifyReply) {
    const { start_date, end_date } = request.params as { start_date: string; end_date: string };
    return PaginationHandler.handlePaginatedRequest(
      request,
      reply,
      (page: number, limit: number) =>
        this.subscriptionService.getByExpiryDateRange(new Date(start_date), new Date(end_date), page, limit),
      {
        notFound: `No subscriptions found expiring between ${start_date} and ${end_date}.`,
        notFoundLog: `No subscriptions found expiring between ${start_date} and ${end_date}.`,
        success: `Subscriptions expiring between ${start_date} and ${end_date} retrieved successfully.`,
        successLog: `Subscriptions expiring between ${start_date} and ${end_date} retrieved successfully.`,
      },
    );
  }

  async updateSubscription(request: FastifyRequest, reply: FastifyReply) {
    const { subscription_id } = request.params as { subscription_id: number };
    const { subcription_billing_frequency, no_of_beneficiaries, subscription_status } = request.body as {
      subcription_billing_frequency?: string;
      no_of_beneficiaries?: number;
      subscription_status?: string;
    };

    const updatedSubscription = await this.subscriptionService.updateSubscription(
      subscription_id,
      subcription_billing_frequency as any,
      no_of_beneficiaries,
      subscription_status as any,
    );

    logger.info(`Subscription with ID ${subscription_id} updated successfully.`);
    return ResponseHandler.success(reply, updatedSubscription, 100, "Subscription updated successfully.");
  }

  async deleteSubscription(request: FastifyRequest, reply: FastifyReply) {
    const { subscription_id } = request.params as { subscription_id: number };
    await this.subscriptionService.deleteSubscription(subscription_id);
    logger.info(`Subscription with ID ${subscription_id} deleted successfully.`);
    return ResponseHandler.success(reply, null, 100, "Subscription deleted successfully.", 204);
  }
}
