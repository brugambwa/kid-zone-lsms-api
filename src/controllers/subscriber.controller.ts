import { FastifyReply, FastifyRequest } from "fastify";
import { ResponseHandler } from "../utils/response";
import { logger } from "../utils/logger";
import { PaginationHandler } from "../utils/pagination.handler";
import { SubscriberService } from "../services/subscriber.service";

export class SubscribersController {
  private readonly subscriberService: SubscriberService;

  constructor() {
    this.subscriberService = new SubscriberService();
  }

  async createSubscriber(req: FastifyRequest, res: FastifyReply) {
    const { first_name, last_name, telephone_number, email_address, village_id, home_address } = req.body as {
      first_name: string;
      last_name: string;
      telephone_number: string;
      email_address: string;
      village_id: number;
      home_address: string;
    };

    const newSubscriber = await this.subscriberService.createSubscriber(
      first_name,
      last_name,
      telephone_number,
      email_address,
      village_id,
      home_address,
    );

    logger.info(`Subscriber created successfully with ID ${newSubscriber.subscriber_id}.`);
    return ResponseHandler.success(res, newSubscriber, 100, "Subscriber created successfully.", 201);
  }

  async getAllSubscribers(request: FastifyRequest, reply: FastifyReply) {
    return PaginationHandler.handlePaginatedRequest(
      request,
      reply,
      (page: number, limit: number) => this.subscriberService.getAllSubscribers(page, limit),
      {
        notFound: "No subscriber records found.",
        notFoundLog: "No subscriber records found.",
        success: "Subscriber records retrieved successfully.",
        successLog: "Subscriber records retrieved successfully.",
      },
    );
  }

  async getSubscriberByID(req: FastifyRequest, res: FastifyReply) {
    const { subscriber_id } = req.params as { subscriber_id: number };
    const subscriber = await this.subscriberService.getSubscriberByID(subscriber_id);
    if (!subscriber) {
      logger.warn(`Subscriber with ID ${subscriber_id} not found.`);
      return ResponseHandler.error(res, `Subscriber with ID ${subscriber_id} not found.`, 101, 200);
    }
    logger.info(`Subscriber with ID ${subscriber_id} retrieved successfully.`);
    return ResponseHandler.success(res, subscriber, 100, "Subscriber retrieved successfully.");
  }

  async getSubscriberByEmail(req: FastifyRequest, res: FastifyReply) {
    const { email } = req.params as { email: string };
    const subscriber = await this.subscriberService.getSubscriberByEmail(email);
    if (!subscriber) {
      logger.warn(`Subscriber with email ${email} not found.`);
      return ResponseHandler.error(res, `Subscriber with email ${email} not found.`, 101, 200);
    }
    logger.info(`Subscriber with email ${email} retrieved successfully.`);
    return ResponseHandler.success(res, subscriber, 100, "Subscriber retrieved successfully.");
  }

  async updateSubscriber(req: FastifyRequest, res: FastifyReply) {
    const { subscriber_id } = req.params as { subscriber_id: number };
    const { first_name, last_name, telephone_number, email_address, village_id, home_address } = req.body as {
      first_name?: string;
      last_name?: string;
      telephone_number?: string;
      email_address?: string;
      village_id?: number;
      home_address?: string;
    };

    const updatedSubscriber = await this.subscriberService.updateSubscriber(
      subscriber_id,
      first_name,
      last_name,
      telephone_number,
      email_address,
      village_id,
      home_address,
    );

    if (!updatedSubscriber) {
      logger.warn(`Subscriber with ID ${subscriber_id} not found for update.`);
      return ResponseHandler.error(res, `Subscriber with ID ${subscriber_id} not found.`, 101, 200);
    }

    logger.info(`Subscriber with ID ${subscriber_id} updated successfully.`);
    return ResponseHandler.success(res, updatedSubscriber, 100, "Subscriber updated successfully.");
  }

  async deleteSubscriber(req: FastifyRequest, res: FastifyReply) {
    const { subscriber_id } = req.params as { subscriber_id: number };
    await this.subscriberService.deleteSubscriber(subscriber_id);
    logger.info(`Subscriber with ID ${subscriber_id} deleted successfully.`);
    return ResponseHandler.success(res, null, 100, "Subscriber deleted successfully.");
  }
}
