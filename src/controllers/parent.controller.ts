import { FastifyReply, FastifyRequest } from "fastify";
import { ParentService, type ParentCreateSubscriptionInput } from "../services/parent.service";
import { ResponseHandler } from "../utils/response";
import { logger } from "../utils/logger";
import { PaginationHandler } from "../utils/pagination.handler";

type SignupBody = {
  first_name: string;
  last_name: string;
  telephone_number: string;
  email_address: string;
  village_id: number;
  home_address: string;
  password: string;
  confirm_password: string;
};

type AddChildBody = {
  subscription_id: number;
  beneficiary_first_name: string;
  beneficiary_last_name: string;
  beneficiary_date_of_birth: string;
  language_preference: string;
  subscription_link_active: string;
  no_of_books: number;
  fullfilment_frequency: string;
  fullfilment_start_date: string;
};

export class ParentController {
  private readonly parentService: ParentService;

  constructor() {
    this.parentService = new ParentService();
  }

  async signup(req: FastifyRequest, res: FastifyReply) {
    const body = req.body as SignupBody;
    const result = await this.parentService.signup(body);
    logger.info(`Parent signup successful for ${body.email_address}.`);
    return ResponseHandler.success(res, result, 100, "Signup successful.", 201);
  }

  async listChildren(req: FastifyRequest, res: FastifyReply) {
    const subscriber_id = req.parent!.sub;
    const children = await this.parentService.listChildren(subscriber_id);
    return ResponseHandler.success(res, children, 100, "Children retrieved successfully.");
  }

  async addChild(req: FastifyRequest, res: FastifyReply) {
    const subscriber_id = req.parent!.sub;
    const body = req.body as AddChildBody;
    const beneficiary = await this.parentService.addChild(subscriber_id, body);
    logger.info(`Parent ${subscriber_id} added child beneficiary ${beneficiary.beneficiary_id}.`);
    return ResponseHandler.success(res, beneficiary, 100, "Child added successfully.", 201);
  }

  async createSubscription(req: FastifyRequest, res: FastifyReply) {
    const subscriber_id = req.parent!.sub;
    const body = req.body as ParentCreateSubscriptionInput;
    const subscription = await this.parentService.createSubscription(subscriber_id, body);
    logger.info(`Parent ${subscriber_id} created subscription ${subscription.subscription_id}.`);
    return ResponseHandler.success(res, subscription, 100, "Subscription created successfully.", 201);
  }

  async listSubscriptions(req: FastifyRequest, res: FastifyReply) {
    const subscriber_id = req.parent!.sub;
    return PaginationHandler.handlePaginatedRequest(
      req,
      res,
      (page: number, limit: number) => this.parentService.listSubscriptions(subscriber_id, page, limit),
      {
        notFound: "No subscriptions found for this account.",
        notFoundLog: "No subscriptions found for parent subscriber.",
        success: "Subscriptions retrieved successfully.",
        successLog: "Parent subscriptions retrieved successfully.",
      },
    );
  }

  async listOrders(req: FastifyRequest, res: FastifyReply) {
    const subscriber_id = req.parent!.sub;
    return PaginationHandler.handlePaginatedRequest(
      req,
      res,
      (page: number, limit: number) => this.parentService.listOrdersForSubscriber(subscriber_id, page, limit),
      {
        notFound: "No orders found for this account.",
        notFoundLog: "No orders found for parent subscriber.",
        success: "Orders retrieved successfully.",
        successLog: "Parent orders retrieved successfully.",
      },
    );
  }

  async listOrdersForChild(req: FastifyRequest, res: FastifyReply) {
    const subscriber_id = req.parent!.sub;
    const { beneficiary_id } = req.params as { beneficiary_id: number };
    const orders = await this.parentService.listOrdersForChild(subscriber_id, beneficiary_id);
    return ResponseHandler.success(res, orders, 100, "Child orders retrieved successfully.");
  }
}
