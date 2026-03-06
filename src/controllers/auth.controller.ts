import { FastifyReply, FastifyRequest } from "fastify";
import { AuthService } from "../services/auth.service";
import { ResponseHandler } from "../utils/response";
import { logger } from "../utils/logger";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } from "../config/constants";
import { BadRequestError, HttpError } from "../utils/http.error";

type LoginBody = {
  email: string;
  password: string;
};

type GoogleCallbackBody = {
  code: string;
};

export class AuthController {
  private readonly authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async login(req: FastifyRequest, res: FastifyReply) {
    const { email, password } = req.body as LoginBody;

    const result = await this.authService.loginWithEmailPassword(email, password);

    logger.info(`Admin login successful for ${email}.`);
    return ResponseHandler.success(res, result, 100, "Login successful.");
  }

  async googleCallback(req: FastifyRequest, res: FastifyReply) {
    const { code } = req.body as GoogleCallbackBody;

    if (!code) {
      throw new BadRequestError("Authorization code is required.");
    }

    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URI) {
      throw new HttpError(500, "Google OAuth is not configured properly.");
    }

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      logger.error(`Google token exchange failed: ${errorText}`);
      throw new HttpError(401, "Failed to exchange authorization code with Google.");
    }

    const tokenData = (await tokenResponse.json()) as {
      access_token: string;
      id_token?: string;
      expires_in: number;
      token_type: string;
      scope?: string;
    };

    if (!tokenData.access_token) {
      throw new HttpError(401, "Google did not return an access token.");
    }

    const userInfoResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    if (!userInfoResponse.ok) {
      const errorText = await userInfoResponse.text();
      logger.error(`Google userinfo fetch failed: ${errorText}`);
      throw new HttpError(401, "Failed to fetch user info from Google.");
    }

    const userInfo = (await userInfoResponse.json()) as {
      sub: string;
      email: string;
      name?: string;
      picture?: string;
      email_verified?: boolean;
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

