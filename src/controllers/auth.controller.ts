import { FastifyReply, FastifyRequest } from "fastify";
import { AuthService } from "../services/auth.service";
import { ResponseHandler } from "../utils/response";
import { logger } from "../utils/logger";
import { GOOGLE_CLIENT_ID } from "../config/constants";
import { BadRequestError, HttpError } from "../utils/http.error";

type LoginBody = {
  email: string;
  password: string;
};

type UpdateProfileBody = {
  display_name?: string;
  email_address?: string;
  google_picture_url?: string;
};

type UpdatePasswordBody = {
  old_password: string;
  new_password: string;
  confirm_password: string;
};

type GoogleVerifyBody = {
  credential: string;
};

/** Tokeninfo response from GET https://oauth2.googleapis.com/tokeninfo?id_token=... */
type GoogleTokenInfo = {
  aud?: string;
  sub: string;
  email?: string;
  email_verified?: string;
  name?: string;
  picture?: string;
  error?: string;
  error_description?: string;
};

export class AuthController {
  private readonly authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async login(req: FastifyRequest, res: FastifyReply) {
    const { email, password } = req.body as LoginBody;

    const result = await this.authService.loginWithEmailPassword(email, password);

    logger.info(`${result.user_type} login successful for ${email}.`);
    return ResponseHandler.success(res, result, 100, "Login successful.");
  }

  async getProfile(req: FastifyRequest, res: FastifyReply) {
    const admin_id = req.admin.sub;
    const profile = await this.authService.getProfile(admin_id);

    logger.info(`Admin profile retrieved for admin ID ${admin_id}.`);
    return ResponseHandler.success(res, profile, 100, "Profile retrieved successfully.");
  }

  async updateProfile(req: FastifyRequest, res: FastifyReply) {
    const admin_id = req.admin.sub;
    const { display_name, email_address, google_picture_url } = req.body as UpdateProfileBody;

    const updatedProfile = await this.authService.updateProfile(admin_id, {
      display_name,
      email_address,
      google_picture_url,
    });

    logger.info(`Admin profile updated for admin ID ${admin_id}.`);
    return ResponseHandler.success(res, updatedProfile, 100, "Profile updated successfully.");
  }

  async updatePassword(req: FastifyRequest, res: FastifyReply) {
    const admin_id = req.admin.sub;
    const { old_password, new_password, confirm_password } = req.body as UpdatePasswordBody;

    await this.authService.updatePassword(admin_id, old_password, new_password, confirm_password);

    logger.info(`Admin password updated for admin ID ${admin_id}.`);
    return ResponseHandler.success(res, null, 100, "Password updated successfully.");
  }

  /**
   * Verify Google ID token via tokeninfo endpoint.
   * Frontend sends the credential (id_token) from Google Sign-In; we verify with Google and then find/create admin.
   */
  async googleVerify(req: FastifyRequest, res: FastifyReply) {
    const { credential } = req.body as GoogleVerifyBody;

    if (!credential || typeof credential !== "string") {
      throw new BadRequestError("Credential (id_token) is required.");
    }

    if (!GOOGLE_CLIENT_ID) {
      throw new HttpError(500, "Google OAuth client ID is not configured.");
    }

    const tokeninfoUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`;
    const tokeninfoResponse = await fetch(tokeninfoUrl);

    if (!tokeninfoResponse.ok) {
      const errorText = await tokeninfoResponse.text();
      logger.error(`Google tokeninfo failed: ${errorText}`);
      throw new HttpError(401, "Invalid or expired Google credential.");
    }

    const tokenInfo = (await tokeninfoResponse.json()) as GoogleTokenInfo;

    if (tokenInfo.error) {
      logger.error(`Google tokeninfo error: ${tokenInfo.error} - ${tokenInfo.error_description ?? ""}`);
      throw new HttpError(401, tokenInfo.error_description ?? "Invalid Google credential.");
    }

    if (tokenInfo.aud !== GOOGLE_CLIENT_ID) {
      logger.warn(`Token aud mismatch: got ${tokenInfo.aud}, expected ${GOOGLE_CLIENT_ID}`);
      throw new HttpError(401, "Credential was not issued for this application.");
    }

    if (!tokenInfo.sub) {
      throw new HttpError(401, "Invalid Google credential: missing sub.");
    }

    const userInfo = {
      sub: tokenInfo.sub,
      email: tokenInfo.email ?? "",
      name: tokenInfo.name,
      picture: tokenInfo.picture,
      email_verified: tokenInfo.email_verified === "true",
    };

    const result = await this.authService.handleGoogleUser(userInfo);

    if (result.token) {
      logger.info(`Google login successful for ${userInfo.email}.`);
      return ResponseHandler.success(res, result, 100, "Login successful.");
    }

    logger.info(`New Google admin created with pending status for ${userInfo.email}.`);
    return ResponseHandler.success(
      res,
      result,
      102,
      "Admin created with pending status. Awaiting approval from existing admins.",
      201,
    );
  }
}

