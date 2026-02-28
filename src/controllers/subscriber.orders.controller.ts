import { FastifyReply, FastifyRequest } from "fastify";
import { ResponseHandler } from "../utils/response";
import { logger } from "../utils/logger";
import { PaginationHandler } from "../utils/pagination.handler";
import { SubscriberOrdersService } from "../services/subscriber.orders.service";

export class SubscriberOrdersController {
  private readonly subscriberOrdersService: SubscriberOrdersService;

  constructor() {
    this.subscriberOrdersService = new SubscriberOrdersService();
  }

  async getByOrderID(req: FastifyRequest, res: FastifyReply) {
    const { order_id } = req.params as { order_id: number };
    const subscriberOrder = await this.subscriberOrdersService.getByOrderID(order_id);
    if (!subscriberOrder) {
      logger.warn(`Subscriber order with ID ${order_id} not found.`);
      return ResponseHandler.error(res, `Subscriber order with ID ${order_id} not found.`, 101, 200);
    }
    logger.info(`Subscriber order with ID ${order_id} retrieved successfully.`);
    return ResponseHandler.success(res, subscriberOrder, 100, "Subscriber order retrieved successfully.");
  }

  async getAllOrders(request: FastifyRequest, reply: FastifyReply) {
    return PaginationHandler.handlePaginatedRequest(
      request,
      reply,
      (page: number, limit: number) => this.subscriberOrdersService.getAll(page, limit),
      {
        notFound: "No subscriber order records found.",
        notFoundLog: "No subscriber order records found.",
        success: "Subscriber order records retrieved successfully.",
        successLog: "Subscriber order records retrieved successfully.",
      },
    );
  }

  async getBySubscriberID(req: FastifyRequest, res: FastifyReply) {
    const { subscriber_id } = req.params as { subscriber_id: number };
    return PaginationHandler.handlePaginatedRequest(
      req,
      res,
      (page: number, limit: number) =>
        this.subscriberOrdersService.getBySubscriberID(subscriber_id, page, limit),
      {
        notFound: `No subscriber order records found for subscriber ID ${subscriber_id}.`,
        notFoundLog: `No subscriber order records found for subscriber ID ${subscriber_id}.`,
        success: `Subscriber order records for subscriber ID ${subscriber_id} retrieved successfully.`,
        successLog: `Subscriber order records for subscriber ID ${subscriber_id} retrieved successfully.`,
      },
    );
  }

  async getByBeneficiaryID(req: FastifyRequest, res: FastifyReply) {
    const { beneficiary_id } = req.params as { beneficiary_id: number };
    const subscriberOrders = await this.subscriberOrdersService.getByBeneficiaryID(beneficiary_id);
    if (subscriberOrders.length === 0) {
      logger.warn(`No subscriber order records found for beneficiary ID ${beneficiary_id}.`);
      return ResponseHandler.error(
        res,
        `No subscriber order records found for beneficiary ID ${beneficiary_id}.`,
        101,
        200,
      );
    }
    logger.info(`Subscriber order records for beneficiary ID ${beneficiary_id} retrieved successfully.`);
    return ResponseHandler.success(
      res,
      subscriberOrders,
      100,
      "Subscriber order records retrieved successfully.",
    );
  }

  async getByStatus(req: FastifyRequest, res: FastifyReply) {
    const { order_status } = req.params as { order_status: string };
    return PaginationHandler.handlePaginatedRequest(
      req,
      res,
      (page: number, limit: number) =>
        this.subscriberOrdersService.getByStatus(order_status as any, page, limit),
      {
        notFound: `No subscriber order records found for status ${order_status}.`,
        notFoundLog: `No subscriber order records found for status ${order_status}.`,
        success: `Subscriber order records for status ${order_status} retrieved successfully.`,
        successLog: `Subscriber order records for status ${order_status} retrieved successfully.`,
      },
    );
  }
}
