import { FastifyReply, FastifyRequest } from "fastify";
import { ResponseHandler } from "../utils/response";
import { logger } from "../utils/logger";
import { PaginationHandler } from "../utils/pagination.handler";
import { OrderFulfillmentService } from "../services/order.fulfillment.service";
import { fulfillment_status } from "@prisma/client";

export class OrderFulfillmentController {
  private readonly orderFulfillmentService: OrderFulfillmentService;

  constructor() {
    this.orderFulfillmentService = new OrderFulfillmentService();
  }

  async createOrderFulfillment(req: FastifyRequest, res: FastifyReply) {
    const {
      beneficiary_id,
      order_id,
      notes,
      fulfillment_date,
      expected_return_date,
      fulfillment_status,
      fulfillment_items,
    } = req.body as {
      beneficiary_id: number;
      order_id: number;
      notes: string;
      fulfillment_status: fulfillment_status;
      fulfillment_date: Date;
      expected_return_date: Date;
      fulfillment_items: any[]; // Replace 'any' with the appropriate type for fulfillment items
    };

    const newOrderFulfillment = await this.orderFulfillmentService.createOrderFulfillment(
      beneficiary_id,
      order_id,
      notes,
      fulfillment_status,
      fulfillment_date,
      expected_return_date,
      fulfillment_items,
    );

    logger.info(`Order fulfillment created successfully with ID ${newOrderFulfillment.fulfillment_id}.`);
    return ResponseHandler.success(
      res,
      newOrderFulfillment,
      100,
      "Order fulfillment created successfully.",
      201,
    );
  }

  async getByID(req: FastifyRequest, res: FastifyReply) {
    const { fulfillment_id } = req.params as { fulfillment_id: number };
    const orderFulfillment = await this.orderFulfillmentService.getByID(fulfillment_id);

    if (!orderFulfillment) {
      logger.warn(`Order fulfillment with ID ${fulfillment_id} not found.`);
      return ResponseHandler.error(res, "Order fulfillment not found.", 101, 200);
    }

    logger.info(`Order fulfillment with ID ${fulfillment_id} retrieved successfully.`);
    return ResponseHandler.success(res, orderFulfillment, 100, "Order fulfillment retrieved successfully.");
  }

  async getAll(req: FastifyRequest, res: FastifyReply) {
    return PaginationHandler.handlePaginatedRequest(
      req,
      res,
      (page: number, limit: number) => this.orderFulfillmentService.getAll(page, limit),
      {
        notFound: "No order fulfillment records found.",
        notFoundLog: "No order fulfillment records found.",
        success: "Order fulfillment records retrieved successfully.",
        successLog: "Order fulfillment records retrieved successfully.",
      },
    );
  }

  async getByOrderID(req: FastifyRequest, res: FastifyReply) {
    const { order_id } = req.params as { order_id: number };
    return PaginationHandler.handlePaginatedRequest(
      req,
      res,
      (page: number, limit: number) => this.orderFulfillmentService.getByOrderID(order_id, page, limit),
      {
        notFound: `No order fulfillment records found for order ID ${order_id}.`,
        notFoundLog: `No order fulfillment records found for order ID ${order_id}.`,
        success: `Order fulfillment records for order ID ${order_id} retrieved successfully.`,
        successLog: `Order fulfillment records for order ID ${order_id} retrieved successfully.`,
      },
    );
  }

  async getByStatus(req: FastifyRequest, res: FastifyReply) {
    const { fulfillment_status } = req.params as { fulfillment_status: fulfillment_status };
    return PaginationHandler.handlePaginatedRequest(
      req,
      res,
      (page: number, limit: number) =>
        this.orderFulfillmentService.getByStatus(fulfillment_status, page, limit),
      {
        notFound: `No order fulfillment records found with status ${fulfillment_status}.`,
        notFoundLog: `No order fulfillment records found with status ${fulfillment_status}.`,
        success: `Order fulfillment records with status ${fulfillment_status} retrieved successfully.`,
        successLog: `Order fulfillment records with status ${fulfillment_status} retrieved successfully.`,
      },
    );
  }

  async getByFulfillmentDateRange(req: FastifyRequest, res: FastifyReply) {
    const { startDate, endDate } = req.query as { startDate: string; endDate: string };
    return PaginationHandler.handlePaginatedRequest(
      req,
      res,
      (page: number, limit: number) =>
        this.orderFulfillmentService.getByFulfillmentDateRange(
          new Date(startDate),
          new Date(endDate),
          page,
          limit,
        ),
      {
        notFound: `No order fulfillment records found within the date range ${startDate} to ${endDate}.`,
        notFoundLog: `No order fulfillment records found within the date range ${startDate} to ${endDate}.`,
        success: `Order fulfillment records within the date range ${startDate} to ${endDate} retrieved successfully.`,
        successLog: `Order fulfillment records within the date range ${startDate} to ${endDate} retrieved successfully.`,
      },
    );
  }

  async getByExpectedReturnDateRange(req: FastifyRequest, res: FastifyReply) {
    const { startDate, endDate } = req.query as { startDate: string; endDate: string };
    return PaginationHandler.handlePaginatedRequest(
      req,
      res,
      (page: number, limit: number) =>
        this.orderFulfillmentService.getByExpectedReturnDateRange(
          new Date(startDate),
          new Date(endDate),
          page,
          limit,
        ),
      {
        notFound: `No order fulfillment records found within the expected return date range ${startDate} to ${endDate}.`,
        notFoundLog: `No order fulfillment records found within the expected return date range ${startDate} to ${endDate}.`,
        success: `Order fulfillment records within the expected return date range ${startDate} to ${endDate} retrieved successfully.`,
        successLog: `Order fulfillment records within the expected return date range ${startDate} to ${endDate} retrieved successfully.`,
      },
    );
  }

  async updateOrderFulfillment(req: FastifyRequest, res: FastifyReply) {
    const { fulfillment_id } = req.params as { fulfillment_id: number };
    const { fulfillment_status } = req.body as { fulfillment_status: fulfillment_status };

    const updatedOrderFulfillment = await this.orderFulfillmentService.updateOrderFulfillment(
      fulfillment_id,
      fulfillment_status,
    );

    if (!updatedOrderFulfillment) {
      logger.warn(`Order fulfillment with ID ${fulfillment_id} not found for update.`);
      return ResponseHandler.error(res, "Order fulfillment not found for update.", 101, 200);
    }

    logger.info(`Order fulfillment with ID ${fulfillment_id} updated successfully.`);
    return ResponseHandler.success(
      res,
      updatedOrderFulfillment,
      100,
      "Order fulfillment updated successfully.",
    );
  }

  async deleteOrderFulfillment(req: FastifyRequest, res: FastifyReply) {
    const { fulfillment_id } = req.params as { fulfillment_id: number };

    await this.orderFulfillmentService.deleteOrderFulfillment(fulfillment_id);

    logger.info(`Order fulfillment with ID ${fulfillment_id} deleted successfully.`);
    return ResponseHandler.success(res, null, 100, "Order fulfillment deleted successfully.");
  }
}
