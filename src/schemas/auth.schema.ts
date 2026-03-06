import { baseResponse, errorResponse } from "./global.schema";

const adminSchema = {
  type: "object",
  properties: {
    admin_id: { type: "number" },
    email_address: { type: "string" },
    display_name: { type: "string" },
    auth_provider: { type: "string" },
    access_level: { type: "string" },
    status: { type: "string" },
    google_sub: { type: ["string", "null"] },
    google_picture_url: { type: ["string", "null"] },
    last_login_at: { type: ["string", "null"], format: "date-time" },
    date_created: { type: "string", format: "date-time" },
    last_update_by: { type: ["string", "null"] },
    last_update_to: { type: ["string", "null"] },
    last_update_at: { type: ["string", "null"], format: "date-time" },
  },
} as const;

const authResponseData = {
  type: "object",
  properties: {
    token: { type: ["string", "null"] },
    admin: adminSchema,
  },
} as const;

const loginBody = {
  type: "object",
  required: ["email", "password"],
  properties: {
    email: { type: "string", format: "email" },
    password: { type: "string", minLength: 6 },
  },
} as const;

const googleVerifyBody = {
  type: "object",
  required: ["credential"],
  properties: {
    credential: {
      type: "string",
      description: "Google ID token (credential) from Sign-In response",
    },
  },
} as const;

const loginSchema = {
  description: "Login admin with email and password",
  tags: ["Auth"],
  body: loginBody,
  response: {
    200: {
      type: "object",
      properties: {
        ...baseResponse,
        data: authResponseData,
      },
    },
    400: errorResponse,
    401: errorResponse,
    403: errorResponse,
    500: errorResponse,
  },
} as const;

const googleVerifySchema = {
  description:
    "Verify Google ID token via tokeninfo. Send the credential (id_token) from Google Sign-In; aud is checked against GOOGLE_CLIENT_ID.",
  tags: ["Auth"],
  body: googleVerifyBody,
  response: {
    200: {
      type: "object",
      properties: {
        ...baseResponse,
        data: authResponseData,
      },
    },
    201: {
      type: "object",
      properties: {
        ...baseResponse,
        data: authResponseData,
      },
    },
    400: errorResponse,
    401: errorResponse,
    403: errorResponse,
    409: errorResponse,
    500: errorResponse,
  },
} as const;

const profileResponseSchema = {
  type: "object",
  properties: {
    ...baseResponse,
    data: adminSchema,
  },
} as const;

const getProfileSchema = {
  description: "Get current admin profile (requires Bearer token)",
  tags: ["Auth"],
  security: [{ bearerAuth: [] }],
  response: {
    200: profileResponseSchema,
    401: errorResponse,
    404: errorResponse,
    500: errorResponse,
  },
} as const;

const updateProfileBody = {
  type: "object",
  properties: {
    display_name: { type: "string", minLength: 1 },
    email_address: { type: "string", format: "email" },
    google_picture_url: { type: "string" },
  },
} as const;

const updateProfileSchema = {
  description: "Update current admin profile (requires Bearer token)",
  tags: ["Auth"],
  security: [{ bearerAuth: [] }],
  body: updateProfileBody,
  response: {
    200: profileResponseSchema,
    400: errorResponse,
    401: errorResponse,
    404: errorResponse,
    409: errorResponse,
    500: errorResponse,
  },
} as const;

const updatePasswordBody = {
  type: "object",
  required: ["old_password", "new_password", "confirm_password"],
  properties: {
    old_password: { type: "string", minLength: 6 },
    new_password: { type: "string", minLength: 6 },
    confirm_password: { type: "string", minLength: 6 },
  },
} as const;

const updatePasswordSchema = {
  description: "Update admin password (requires Bearer token, local accounts only)",
  tags: ["Auth"],
  security: [{ bearerAuth: [] }],
  body: updatePasswordBody,
  response: {
    200: {
      type: "object",
      properties: {
        ...baseResponse,
        data: { type: "null" },
      },
    },
    400: errorResponse,
    401: errorResponse,
    404: errorResponse,
    500: errorResponse,
  },
} as const;

export const authSchemas = {
  login: loginSchema,
  googleVerify: googleVerifySchema,
  getProfile: getProfileSchema,
  updateProfile: updateProfileSchema,
  updatePassword: updatePasswordSchema,
};

