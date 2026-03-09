import { baseResponse, errorResponse, paginationObject, paginationQuerystring } from "./global.schema";

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

const singleAdminResponse = {
  type: "object",
  properties: {
    ...baseResponse,
    data: adminSchema,
  },
} as const;

const listAdminsResponse = {
  type: "object",
  properties: {
    ...baseResponse,
    data: {
      type: "array",
      items: adminSchema,
    },
    pagination: paginationObject,
  },
} as const;

const adminIdParam = {
  type: "object",
  required: ["admin_id"],
  properties: {
    admin_id: {
      type: "string",
      pattern: String.raw`^[1-9][0-9]*$`,
      description: "Admin ID",
    },
  },
} as const;

const listAdminsSchema = {
  description: "Get all admins with optional filters",
  tags: ["Admins"],
  security: [{ bearerAuth: [] }],
  querystring: {
    type: "object",
    properties: {
      status: { type: "string", enum: ["pending", "active", "suspended"] },
      access_level: { type: "string", enum: ["super_admin", "admin", "librarian", "support"] },
      ...paginationQuerystring.properties,
    },
  },
  response: {
    200: listAdminsResponse,
    400: errorResponse,
    401: errorResponse,
    500: errorResponse,
  },
} as const;

const getAdminByIdSchema = {
  description: "Get admin by ID",
  tags: ["Admins"],
  security: [{ bearerAuth: [] }],
  params: adminIdParam,
  response: {
    200: singleAdminResponse,
    400: errorResponse,
    401: errorResponse,
    404: errorResponse,
    500: errorResponse,
  },
} as const;

const createAdminBody = {
  type: "object",
  required: ["email_address", "display_name", "access_level"],
  properties: {
    email_address: { type: "string", format: "email" },
    display_name: { type: "string", minLength: 1 },
    access_level: { type: "string", enum: ["super_admin", "admin", "librarian", "support"] },
    auth_provider: { type: "string", enum: ["local", "google"], default: "local" },
    password: { type: "string", minLength: 6 },
    status: { type: "string", enum: ["pending", "active", "suspended"], default: "active" },
  },
} as const;

const createAdminSchema = {
  description: "Create a new admin",
  tags: ["Admins"],
  security: [{ bearerAuth: [] }],
  body: createAdminBody,
  response: {
    201: singleAdminResponse,
    400: errorResponse,
    401: errorResponse,
    403: errorResponse,
    409: errorResponse,
    500: errorResponse,
  },
} as const;

const updateAdminBody = {
  type: "object",
  properties: {
    email_address: { type: "string", format: "email" },
    display_name: { type: "string", minLength: 1 },
    access_level: { type: "string", enum: ["super_admin", "admin", "librarian", "support"] },
    status: { type: "string", enum: ["pending", "active", "suspended"] },
  },
} as const;

const updateAdminSchema = {
  description: "Update an admin by ID",
  tags: ["Admins"],
  security: [{ bearerAuth: [] }],
  params: adminIdParam,
  body: updateAdminBody,
  response: {
    200: singleAdminResponse,
    400: errorResponse,
    401: errorResponse,
    403: errorResponse,
    404: errorResponse,
    409: errorResponse,
    500: errorResponse,
  },
} as const;

const deleteAdminSchema = {
  description: "Delete an admin by ID",
  tags: ["Admins"],
  security: [{ bearerAuth: [] }],
  params: adminIdParam,
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
    403: errorResponse,
    404: errorResponse,
    500: errorResponse,
  },
} as const;

export const adminsSchemas = {
  listAdmins: listAdminsSchema,
  getAdminById: getAdminByIdSchema,
  createAdmin: createAdminSchema,
  updateAdmin: updateAdminSchema,
  deleteAdmin: deleteAdminSchema,
};

