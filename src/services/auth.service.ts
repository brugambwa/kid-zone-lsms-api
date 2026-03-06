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
    };

    const secret: Secret = JWT_SECRET as Secret;
    const options: SignOptions = {
      expiresIn: JWT_EXPIRES_IN as SignOptions["expiresIn"],
    };

    return jwt.sign(payload, secret, options);
  }

  async loginWithEmailPassword(email: string, password: string) {
    const admin = (await prismaAny.admins.findUnique({
      where: { email_address: email },
    })) as AdminEntity | null;

    if (!admin || !admin.password_hash) {
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
      data: {
        last_login_at: new Date(),
      },
    })) as AdminEntity;

    const token = this.generateToken(updatedAdmin);
    return {
      token,
      admin: this.sanitizeAdmin(updatedAdmin),
    };
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


