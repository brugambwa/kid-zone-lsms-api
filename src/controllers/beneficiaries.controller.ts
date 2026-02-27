import { FastifyReply, FastifyRequest } from "fastify";
import { ResponseHandler } from "../utils/response";
import { logger } from "../utils/logger";
import { PaginationHandler } from "../utils/pagination.handler";
import { BeneficiaryService } from "../services/beneficiaries.service";
import { subscription_link_active } from "@prisma/client";

export class BeneficiariesController {
  private readonly beneficiariesService: BeneficiaryService;

  constructor() {
    this.beneficiariesService = new BeneficiaryService();
  }

  async createSubscriptionBeneficiary(req: FastifyRequest, res: FastifyReply) {
    const {
      subscription_id,
      subscriber_id,
      beneficiary_first_name,
      beneficiary_last_name,
      beneficiary_date_of_birth,
      language_preference,
      subscription_link_active,
    } = req.body as {
      subscription_id: number;
      subscriber_id: number;
      beneficiary_first_name: string;
      beneficiary_last_name: string;
      beneficiary_date_of_birth: Date;
      language_preference: string;
      subscription_link_active: subscription_link_active;
    };

    const newBeneficiary = await this.beneficiariesService.createSubscriptionBeneficiary({
      subscription_id,
      subscriber_id,
      beneficiary_first_name,
      beneficiary_last_name,
      beneficiary_date_of_birth,
      language_preference,
      subscription_link_active,
    });

    logger.info(`Subscription beneficiary created successfully with ID ${newBeneficiary.beneficiary_id}.`);
    return ResponseHandler.success(
      res,
      newBeneficiary,
      100,
      "Subscription beneficiary created successfully.",
      201,
    );
  }

  async getAllBeneficiaries(request: FastifyRequest, reply: FastifyReply) {
    return PaginationHandler.handlePaginatedRequest(
      request,
      reply,
      (page: number, limit: number) => this.beneficiariesService.getAllBeneficiaries(page, limit),
      {
        notFound: "No subscription beneficiary records found.",
        notFoundLog: "No subscription beneficiary records found.",
        success: "Subscription beneficiary records retrieved successfully.",
        successLog: "Subscription beneficiary records retrieved successfully.",
      },
    );
  }

  async getByBeneficiaryID(req: FastifyRequest, res: FastifyReply) {
    const { beneficiary_id } = req.params as { beneficiary_id: number };
    const beneficiaries = await this.beneficiariesService.getByBeneficiaryID(beneficiary_id);
    if (beneficiaries.length === 0) {
      logger.warn(`No subscription beneficiaries found with beneficiary ID ${beneficiary_id}.`);
      return ResponseHandler.error(
        res,
        `No subscription beneficiaries found with beneficiary ID ${beneficiary_id}.`,
        101,
        200,
      );
    }
    logger.info(`Subscription beneficiaries with beneficiary ID ${beneficiary_id} retrieved successfully.`);
    return ResponseHandler.success(
      res,
      beneficiaries,
      100,
      "Subscription beneficiaries retrieved successfully.",
    );
  }

  async getBySubscriberID(req: FastifyRequest, res: FastifyReply) {
    const { subscriber_id } = req.params as { subscriber_id: number };
    const beneficiaries = await this.beneficiariesService.getBySubcriberID(subscriber_id);
    if (beneficiaries.length === 0) {
      logger.warn(`No subscription beneficiaries found with subscriber ID ${subscriber_id}.`);
      return ResponseHandler.error(
        res,
        `No subscription beneficiaries found with subscriber ID ${subscriber_id}.`,
        101,
        200,
      );
    }
    logger.info(`Subscription beneficiaries with subscriber ID ${subscriber_id} retrieved successfully.`);
    return ResponseHandler.success(
      res,
      beneficiaries,
      100,
      "Subscription beneficiaries retrieved successfully.",
    );
  }

  async getBySubscriptionID(req: FastifyRequest, res: FastifyReply) {
    const { subscription_id } = req.params as { subscription_id: number };
    const beneficiaries = await this.beneficiariesService.getBySubscriptionID(subscription_id);
    if (beneficiaries.length === 0) {
      logger.warn(`No subscription beneficiaries found with subscription ID ${subscription_id}.`);
      return ResponseHandler.error(
        res,
        `No subscription beneficiaries found with subscription ID ${subscription_id}.`,
        101,
        200,
      );
    }
    logger.info(`Subscription beneficiaries with subscription ID ${subscription_id} retrieved successfully.`);
    return ResponseHandler.success(
      res,
      beneficiaries,
      100,
      "Subscription beneficiaries retrieved successfully.",
    );
  }

  async getByLinkStatus(req: FastifyRequest, res: FastifyReply) {
    const { subscription_link_active } = req.query as { subscription_link_active: subscription_link_active };
    return PaginationHandler.handlePaginatedRequest(
      req,
      res,
      (page: number, limit: number) =>
        this.beneficiariesService.getByLinkStatus(subscription_link_active, page, limit),
      {
        notFound: `No subscription beneficiaries found with link status ${subscription_link_active}.`,
        notFoundLog: `No subscription beneficiaries found with link status ${subscription_link_active}.`,
        success: `Subscription beneficiaries with link status ${subscription_link_active} retrieved successfully.`,
        successLog: `Subscription beneficiaries with link status ${subscription_link_active} retrieved successfully.`,
      },
    );
  }

  async updateSubscriptionBeneficiary(req: FastifyRequest, res: FastifyReply) {
    const { beneficiary_id } = req.params as { beneficiary_id: number };
    const { subscription_id, subscriber_id, subscription_link_active } = req.body as {
      subscription_id?: number;
      subscriber_id?: number;
      subscription_link_active?: subscription_link_active;
    };

    const updatedBeneficiary = await this.beneficiariesService.updateSubscriptionBeneficiary(beneficiary_id, {
      subscription_id,
      subscriber_id,
      subscription_link_active,
    });

    if (!updatedBeneficiary) {
      logger.warn(`Subscription beneficiary with ID ${beneficiary_id} not found for update.`);
      return ResponseHandler.error(
        res,
        `Subscription beneficiary with ID ${beneficiary_id} not found for update.`,
        101,
        200,
      );
    }

    logger.info(`Subscription beneficiary with ID ${beneficiary_id} updated successfully.`);
    return ResponseHandler.success(
      res,
      updatedBeneficiary,
      100,
      "Subscription beneficiary updated successfully.",
    );
  }

  async deleteSubscriptionBeneficiary(req: FastifyRequest, res: FastifyReply) {
    const { beneficiary_id } = req.params as { beneficiary_id: number };
    await this.beneficiariesService.deleteSubscriptionBeneficiary(beneficiary_id);
    logger.info(`Subscription beneficiary with ID ${beneficiary_id} deleted successfully.`);
    return ResponseHandler.success(res, null, 100, "Subscription beneficiary deleted successfully.");
  }
}
