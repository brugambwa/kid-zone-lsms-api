import bcrypt from "bcryptjs";
import { prismaDBConn } from "../config/prisma";
import { AuthAdminPayload } from "../middleware/auth.middleware";
import { BadRequestError, HttpError } from "../utils/http.error";
import { generateRandomPassword, sendAdminWelcomeEmail } from "../utils/email";

type AdminStatus = "pending" | "active" | "suspended";
type AccessLevel = "super_admin" | "admin" | "librarian" | "support";
type AuthProvider = "local" | "google";

type AdminEntity = {
  admin_id: number;
  email_address: string;
  display_name: string;
  password_hash: string | null;
  auth_provider: AuthProvider;
  google_sub: string | null;
  google_picture_url: string | null;
  access_level: AccessLevel;
  status: AdminStatus;
  last_login_at: Date | null;
  date_created: Date;
  last_update_by: string | null;
  last_update_to: string | null;
  last_update_at: Date | null;
};

type AdminSafe = Omit<AdminEntity, "password_hash">;

const prismaAny = prismaDBConn as any;

const ACCESS_LEVEL_RANK: Record<AccessLevel, number> = {
  support: 1,
  librarian: 2,
  admin: 3,
  super_admin: 4,
};

type CreateAdminInput = {
  email_address: string;
  display_name: string;
  access_level: AccessLevel;
  auth_provider?: AuthProvider;
  password?: string;
  status?: AdminStatus;
};

type UpdateAdminInput = {
  display_name?: string;
  email_address?: string;
  access_level?: AccessLevel;
  status?: AdminStatus;
};

export class AdminsService {
  private sanitize(admin: AdminEntity): AdminSafe {
    const { password_hash, ...rest } = admin;
    return rest;
  }

  private ensureCanManage(current: AuthAdminPayload, target: AdminEntity, allowSelfProfileUpdate = false) {
    const currentRank = ACCESS_LEVEL_RANK[(current.access_level as AccessLevel) || "support"] ?? 0;
    const targetRank = ACCESS_LEVEL_RANK[target.access_level] ?? 0;

    // Cannot manage users with higher rank
    if (targetRank > currentRank) {
      throw new HttpError(403, "You cannot modify an admin with a higher access level.");
    }

    // For updates/deletes, prevent modifying peers of same rank unless super_admin
    if (!allowSelfProfileUpdate && targetRank === currentRank && current.access_level !== "super_admin") {
      throw new HttpError(403, "You cannot modify an admin with the same access level.");
    }
  }

  async listAdmins(
    _current: AuthAdminPayload,
    page: number,
    limit: number,
    filters?: { status?: AdminStatus; access_level?: AccessLevel },
  ): Promise<{ data: AdminSafe[]; total: number }> {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.access_level) {
      where.access_level = filters.access_level;
    }

    const [records, total] = (await Promise.all([
      prismaAny.admins.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date_created: "desc" },
      }),
      prismaAny.admins.count({ where }),
    ])) as [AdminEntity[], number];

    return {
      data: records.map((a) => this.sanitize(a)),
      total,
    };
  }

  async getAdminById(_current: AuthAdminPayload, admin_id: number): Promise<AdminSafe | null> {
    const admin = (await prismaAny.admins.findUnique({
      where: { admin_id },
    })) as AdminEntity | null;

    if (!admin) {
      return null;
    }

    return this.sanitize(admin);
  }

  async createAdmin(current: AuthAdminPayload, input: CreateAdminInput): Promise<AdminSafe> {
    const auth_provider: AuthProvider = input.auth_provider ?? "local";
    const status: AdminStatus = input.status ?? "active";

    // Only super_admin can create another super_admin
    if (input.access_level === "super_admin" && current.access_level !== "super_admin") {
      throw new HttpError(403, "Only super admins can create another super admin.");
    }

    const existing = (await prismaAny.admins.findUnique({
      where: { email_address: input.email_address },
    })) as AdminEntity | null;

    if (existing) {
      throw new HttpError(409, "An admin with this email address already exists.");
    }

    let password_hash: string | null = null;
    let plainPassword: string | null = null;
    if (auth_provider === "local") {
      plainPassword = input.password && input.password.length >= 6 ? input.password : generateRandomPassword(12);
      password_hash = await bcrypt.hash(plainPassword, 10);
    }

    const created = (await prismaAny.admins.create({
      data: {
        email_address: input.email_address,
        display_name: input.display_name,
        access_level: input.access_level,
        auth_provider,
        password_hash,
        status,
      },
    })) as AdminEntity;

    if (auth_provider === "local" && plainPassword) {
      await sendAdminWelcomeEmail({
        to: created.email_address,
        displayName: created.display_name,
        password: plainPassword,
      });
    }

    return this.sanitize(created);
  }

  async updateAdmin(current: AuthAdminPayload, admin_id: number, input: UpdateAdminInput): Promise<AdminSafe | null> {
    const admin = (await prismaAny.admins.findUnique({
      where: { admin_id },
    })) as AdminEntity | null;

    if (!admin) {
      return null;
    }

    // Prevent self role/status changes; they should use profile endpoints for basic updates
    const isSelf = current.sub === admin_id;
    if (isSelf && (input.access_level || input.status)) {
      throw new HttpError(403, "You cannot change your own access level or status.");
    }

    this.ensureCanManage(current, admin);

    if (input.email_address && input.email_address !== admin.email_address) {
      const existing = (await prismaAny.admins.findUnique({
        where: { email_address: input.email_address },
      })) as AdminEntity | null;
      if (existing && existing.admin_id !== admin_id) {
        throw new HttpError(409, "An admin with this email address already exists.");
      }
    }

    if (input.access_level === "super_admin" && current.access_level !== "super_admin") {
      throw new HttpError(403, "Only super admins can assign the super admin role.");
    }

    const updated = (await prismaAny.admins.update({
      where: { admin_id },
      data: {
        ...(input.display_name && { display_name: input.display_name }),
        ...(input.email_address && { email_address: input.email_address }),
        ...(input.access_level && { access_level: input.access_level }),
        ...(input.status && { status: input.status }),
        last_update_at: new Date(),
        last_update_by: current.email,
      },
    })) as AdminEntity;

    return this.sanitize(updated);
  }

  async deleteAdmin(current: AuthAdminPayload, admin_id: number): Promise<void> {
    if (current.sub === admin_id) {
      throw new HttpError(403, "You cannot delete your own admin account.");
    }

    const admin = (await prismaAny.admins.findUnique({
      where: { admin_id },
    })) as AdminEntity | null;

    if (!admin) {
      throw new HttpError(404, "Admin not found.");
    }

    this.ensureCanManage(current, admin);

    await prismaAny.admins.delete({
      where: { admin_id },
    });
  }
}

