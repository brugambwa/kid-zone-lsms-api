import { FastifyReply, FastifyRequest } from "fastify";
import { AdminsService } from "../services/admins.service";
import { PaginationHandler } from "../utils/pagination.handler";
import { ResponseHandler } from "../utils/response";
import { logger } from "../utils/logger";

type ListAdminsQuery = {
  status?: "pending" | "active" | "suspended";
  access_level?: "super_admin" | "admin" | "librarian" | "support";
  page?: string;
  limit?: string;
};

type CreateAdminBody = {
  email_address: string;
  display_name: string;
  access_level: "super_admin" | "admin" | "librarian" | "support";
  auth_provider?: "local" | "google";
  password?: string;
  status?: "pending" | "active" | "suspended";
};

type UpdateAdminBody = {
  display_name?: string;
  email_address?: string;
  access_level?: "super_admin" | "admin" | "librarian" | "support";
  status?: "pending" | "active" | "suspended";
};

export class AdminsController {
  private readonly adminsService: AdminsService;

  constructor() {
    this.adminsService = new AdminsService();
  }

  async listAdmins(req: FastifyRequest, res: FastifyReply) {
    const { status, access_level } = req.query as ListAdminsQuery;
    const current = req.admin;

    return PaginationHandler.handlePaginatedRequest(
      req,
      res,
      (page: number, limit: number) =>
        this.adminsService.listAdmins(
          current,
          page,
          limit,
          {
            status,
            access_level,
          } as any,
        ),
      {
        notFound: "No admin records found.",
        notFoundLog: "No admin records found.",
        success: "Admin records retrieved successfully.",
        successLog: "Admin records retrieved successfully.",
      },
    );
  }

  async getAdminById(req: FastifyRequest, res: FastifyReply) {
    const { admin_id } = req.params as { admin_id: number };
    const current = req.admin;

    const admin = await this.adminsService.getAdminById(current, admin_id);
    if (!admin) {
      logger.warn(`Admin with ID ${admin_id} not found.`);
      return ResponseHandler.error(res, `Admin with ID ${admin_id} not found.`, 101, 200);
    }

    logger.info(`Admin with ID ${admin_id} retrieved successfully.`);
    return ResponseHandler.success(res, admin, 100, "Admin retrieved successfully.");
  }

  async createAdmin(req: FastifyRequest, res: FastifyReply) {
    const current = req.admin;
    const { email_address, display_name, access_level, auth_provider, password, status } = req.body as CreateAdminBody;

    const admin = await this.adminsService.createAdmin(current, {
      email_address,
      display_name,
      access_level,
      auth_provider,
      password,
      status,
    });

    logger.info(`Admin created successfully with email ${email_address}.`);
    return ResponseHandler.success(res, admin, 100, "Admin created successfully.", 201);
  }

  async updateAdmin(req: FastifyRequest, res: FastifyReply) {
    const current = req.admin;
    const { admin_id } = req.params as { admin_id: number };
    const { display_name, email_address, access_level, status } = req.body as UpdateAdminBody;

    const updated = await this.adminsService.updateAdmin(current, admin_id, {
      display_name,
      email_address,
      access_level,
      status,
    });

    if (!updated) {
      logger.warn(`Admin with ID ${admin_id} not found for update.`);
      return ResponseHandler.error(res, `Admin with ID ${admin_id} not found.`, 101, 200);
    }

    logger.info(`Admin with ID ${admin_id} updated successfully.`);
    return ResponseHandler.success(res, updated, 100, "Admin updated successfully.");
  }

  async deleteAdmin(req: FastifyRequest, res: FastifyReply) {
    const current = req.admin;
    const { admin_id } = req.params as { admin_id: number };

    await this.adminsService.deleteAdmin(current, admin_id);

    logger.info(`Admin with ID ${admin_id} deleted successfully.`);
    return ResponseHandler.success(res, null, 100, "Admin deleted successfully.");
  }
}

