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

const googleCallbackBody = {
  type: "object",
  required: ["code"],
  properties: {
    code: { type: "string" },
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

const googleCallbackSchema = {
  description: "Handle Google OAuth callback and login or create admin",
  tags: ["Auth"],
  body: googleCallbackBody,
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

export const authSchemas = {
  login: loginSchema,
  googleCallback: googleCallbackSchema,
};

