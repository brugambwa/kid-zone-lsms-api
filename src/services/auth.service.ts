import bcrypt from "bcryptjs";
import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import { prismaDBConn } from "../config/prisma";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/constants";
import { BadRequestError, HttpError } from "../utils/http.error";

type AdminStatus = "pending" | "active" | "suspended";
type AuthProvider = "local" | "google";

type AdminJwtPayload = {
  sub: number;
  email: string;
  access_level: string;
  status: AdminStatus;
  provider: AuthProvider;
  scope: "admin";
};

type ParentJwtPayload = {
  sub: number;
  email: string;
  scope: "parent";
};

type AdminEntity = {
  admin_id: number;
  email_address: string;
  display_name: string;
  password_hash: string | null;
  auth_provider: AuthProvider;
  google_sub: string | null;
  google_picture_url: string | null;
  access_level: string;
  status: AdminStatus;
  last_login_at: Date | null;
  date_created: Date;
  last_update_by: string | null;
  last_update_to: string | null;
  last_update_at: Date | null;
};

type GoogleUserInfo = {
  sub: string;
  email: string;
  name?: string;
  picture?: string;
  email_verified?: boolean;
};

const prismaAny = prismaDBConn as any;

export class AuthService {
  private sanitizeAdmin(admin: AdminEntity) {
    const { password_hash, ...rest } = admin;
    return rest;
  }

  private generateToken(admin: AdminEntity): string {
    const payload: AdminJwtPayload = {
      sub: admin.admin_id,
      email: admin.email_address,
      access_level: admin.access_level,
      status: admin.status,
      provider: admin.auth_provider,
      scope: "admin",
    };

    const secret: Secret = JWT_SECRET as Secret;
    const options: SignOptions = {
      expiresIn: JWT_EXPIRES_IN as SignOptions["expiresIn"],
    };

    return jwt.sign(payload, secret, options);
  }

  private generateParentToken(subscriber_id: number, email_address: string): string {
    const payload: ParentJwtPayload = {
      sub: subscriber_id,
      email: email_address,
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

  /**
   * Unified login: try admin first, then subscriber (parent) with password_hash.
   */
  async loginWithEmailPassword(email: string, password: string) {
    const admin = (await prismaAny.admins.findUnique({
      where: { email_address: email },
    })) as AdminEntity | null;

    if (admin) {
      if (!admin.password_hash) {
        throw new HttpError(401, "Invalid email or password.");
      }
      if (admin.status !== "active") {
        throw new HttpError(403, "Admin account is not active.");
      }
      if (admin.auth_provider !== "local") {
        throw new BadRequestError("This admin account uses Google login.");
      }
      const isValid = await bcrypt.compare(password, admin.password_hash);
      if (!isValid) {
        throw new HttpError(401, "Invalid email or password.");
      }
      const updatedAdmin = (await prismaAny.admins.update({
        where: { admin_id: admin.admin_id },
        data: { last_login_at: new Date() },
      })) as AdminEntity;
      const token = this.generateToken(updatedAdmin);
      return {
        user_type: "admin" as const,
        token,
        user: this.sanitizeAdmin(updatedAdmin),
      };
    }

    const subscriber = (await prismaAny.subscribers.findUnique({
      where: { email_address: email },
    })) as Record<string, unknown> | null;

    if (!subscriber || !subscriber.password_hash) {
      throw new HttpError(401, "Invalid email or password.");
    }

    const isSubValid = await bcrypt.compare(password, subscriber.password_hash as string);
    if (!isSubValid) {
      throw new HttpError(401, "Invalid email or password.");
    }

    const token = this.generateParentToken(
      subscriber.subscriber_id as number,
      subscriber.email_address as string,
    );
    return {
      user_type: "parent" as const,
      token,
      user: this.sanitizeSubscriber(subscriber),
    };
  }

  async getProfile(admin_id: number) {
    const admin = (await prismaAny.admins.findUnique({
      where: { admin_id },
    })) as AdminEntity | null;

    if (!admin) {
      throw new HttpError(404, "Admin not found.");
    }

    return this.sanitizeAdmin(admin);
  }

  async updateProfile(
    admin_id: number,
    data: { display_name?: string; email_address?: string; google_picture_url?: string },
  ) {
    const admin = (await prismaAny.admins.findUnique({
      where: { admin_id },
    })) as AdminEntity | null;

    if (!admin) {
      throw new HttpError(404, "Admin not found.");
    }

    if (data.email_address && data.email_address !== admin.email_address) {
      const existing = (await prismaAny.admins.findUnique({
        where: { email_address: data.email_address },
      })) as AdminEntity | null;

      if (existing) {
        throw new HttpError(409, "Email address is already in use.");
      }
    }

    const updatedAdmin = (await prismaAny.admins.update({
      where: { admin_id },
      data: {
        ...(data.display_name && { display_name: data.display_name }),
        ...(data.email_address && { email_address: data.email_address }),
        ...(data.google_picture_url !== undefined && { google_picture_url: data.google_picture_url }),
        last_update_at: new Date(),
      },
    })) as AdminEntity;

    return this.sanitizeAdmin(updatedAdmin);
  }

  async updatePassword(admin_id: number, old_password: string, new_password: string, confirm_password: string) {
    if (new_password !== confirm_password) {
      throw new BadRequestError("New password and confirm password do not match.");
    }

    const admin = (await prismaAny.admins.findUnique({
      where: { admin_id },
    })) as AdminEntity | null;

    if (!admin) {
      throw new HttpError(404, "Admin not found.");
    }

    if (admin.auth_provider !== "local" || !admin.password_hash) {
      throw new BadRequestError("Password update is only available for email/password accounts.");
    }

    const isValid = await bcrypt.compare(old_password, admin.password_hash);
    if (!isValid) {
      throw new HttpError(401, "Current password is incorrect.");
    }

    const hashed = await bcrypt.hash(new_password, 10);

    await prismaAny.admins.update({
      where: { admin_id },
      data: {
        password_hash: hashed,
        last_update_at: new Date(),
      },
    });
  }

  async handleGoogleUser(userInfo: GoogleUserInfo) {
    if (!userInfo.email || !userInfo.sub) {
      throw new BadRequestError("Invalid Google user info response.");
    }

    if (userInfo.email_verified === false) {
      throw new HttpError(401, "Google email is not verified.");
    }

    // Prefer lookup by google_sub, fallback to email match
    const existingAdmin = (await prismaAny.admins.findFirst({
      where: {
        OR: [{ google_sub: userInfo.sub }, { email_address: userInfo.email }],
      },
    })) as AdminEntity | null;

    if (existingAdmin) {
      if (existingAdmin.status === "pending") {
        throw new HttpError(409, "User already exists and is pending approval.");
      }

      if (existingAdmin.status !== "active") {
        throw new HttpError(403, "Admin account is not allowed to login.");
      }

      const updatedAdmin = (await prismaAny.admins.update({
        where: { admin_id: existingAdmin.admin_id },
        data: {
          auth_provider: "google",
          google_sub: userInfo.sub,
          google_picture_url: userInfo.picture ?? existingAdmin.google_picture_url,
          display_name: userInfo.name ?? existingAdmin.display_name,
          last_login_at: new Date(),
        },
      })) as AdminEntity;

      const token = this.generateToken(updatedAdmin);
      return {
        token,
        admin: this.sanitizeAdmin(updatedAdmin),
      };
    }

    // Create new pending admin
    const newAdmin = (await prismaAny.admins.create({
      data: {
        email_address: userInfo.email,
        display_name: userInfo.name || userInfo.email,
        auth_provider: "google",
        google_sub: userInfo.sub,
        google_picture_url: userInfo.picture ?? null,
        status: "pending",
      },
    })) as AdminEntity;

    return {
      token: null,
      admin: this.sanitizeAdmin(newAdmin),
    };
  }
}


