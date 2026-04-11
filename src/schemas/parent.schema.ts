import { baseResponse, errorResponse, paginationObject, paginationQuerystring } from "./global.schema";

const subscriberPublicSchema = {
  type: "object",
  properties: {
    subscriber_id: { type: "number" },
    first_name: { type: "string" },
    last_name: { type: "string" },
    telephone_number: { type: "string" },
    email_address: { type: "string" },
    village_id: { type: "number" },
    home_address: { type: "string" },
    date_created: { type: "string", format: "date-time" },
    last_update_by: { type: ["string", "null"] },
    last_update_to: { type: ["string", "null"] },
    last_update_at: { type: ["string", "null"], format: "date-time" },
  },
} as const;

const parentAuthResponse = {
  type: "object",
  properties: {
    token: { type: "string" },
    subscriber: subscriberPublicSchema,
  },
} as const;

const signupBody = {
  type: "object",
  required: [
    "first_name",
    "last_name",
    "telephone_number",
    "email_address",
    "village_id",
    "home_address",
    "password",
    "confirm_password",
  ],
  properties: {
    first_name: { type: "string", minLength: 1 },
    last_name: { type: "string", minLength: 1 },
    telephone_number: { type: "string", minLength: 1 },
    email_address: { type: "string", format: "email" },
    village_id: { type: "number" },
    home_address: { type: "string", minLength: 1 },
    password: { type: "string", minLength: 6 },
    confirm_password: { type: "string", minLength: 6 },
  },
} as const;

const addChildBody = {
  type: "object",
  required: [
    "subscription_id",
    "beneficiary_first_name",
    "beneficiary_last_name",
    "beneficiary_date_of_birth",
    "language_preference",
    "subscription_link_active",
    "no_of_books",
    "fullfilment_frequency",
    "fullfilment_start_date",
  ],
  properties: {
    subscription_id: { type: "number" },
    beneficiary_first_name: { type: "string" },
    beneficiary_last_name: { type: "string" },
    beneficiary_date_of_birth: { type: "string", format: "date" },
    language_preference: { type: "string" },
    subscription_link_active: { type: "string", enum: ["yes", "no"] },
    no_of_books: { type: "number" },
    fullfilment_frequency: { type: "string", enum: ["weekly", "bi_weekly"] },
    fullfilment_start_date: { type: "string", format: "date" },
  },
} as const;

const beneficiaryIdParam = {
  type: "object",
  required: ["beneficiary_id"],
  properties: {
    beneficiary_id: {
      type: "string",
      pattern: String.raw`^[1-9][0-9]*$`,
    },
  },
} as const;

export const parentSchemas = {
  signup: {
    description: "Parent (subscriber) self-service signup",
    tags: ["Parent"],
    body: signupBody,
    response: {
      201: { type: "object", properties: { ...baseResponse, data: parentAuthResponse } },
      400: errorResponse,
      409: errorResponse,
      500: errorResponse,
    },
  } as const,
  listChildren: {
    description: "List children (beneficiaries) for logged-in parent",
    tags: ["Parent"],
    security: [{ bearerAuth: [] }],
    response: {
      200: {
        type: "object",
        properties: {
          ...baseResponse,
          data: { type: "array", items: {} },
        },
      },
      401: errorResponse,
      500: errorResponse,
    },
  } as const,
  addChild: {
    description: "Add a child (beneficiary) under parent subscription",
    tags: ["Parent"],
    security: [{ bearerAuth: [] }],
    body: addChildBody,
    response: {
      201: { type: "object", properties: { ...baseResponse, data: {} } },
      400: errorResponse,
      401: errorResponse,
      403: errorResponse,
      500: errorResponse,
    },
  } as const,
  listOrders: {
    description: "List all orders for logged-in parent (history)",
    tags: ["Parent"],
    security: [{ bearerAuth: [] }],
    querystring: paginationQuerystring,
    response: {
      200: {
        type: "object",
        properties: {
          ...baseResponse,
          data: { type: "array", items: {} },
          pagination: paginationObject,
        },
      },
      401: errorResponse,
      500: errorResponse,
    },
  } as const,
  listOrdersForChild: {
    description: "List orders for one child (beneficiary) of logged-in parent",
    tags: ["Parent"],
    security: [{ bearerAuth: [] }],
    params: beneficiaryIdParam,
    response: {
      200: {
        type: "object",
        properties: {
          ...baseResponse,
          data: { type: "array", items: {} },
        },
      },
      401: errorResponse,
      404: errorResponse,
      500: errorResponse,
    },
  } as const,
};
