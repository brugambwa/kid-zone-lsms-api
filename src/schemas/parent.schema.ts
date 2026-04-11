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

const subscriptionBeneficiaryOnCreate = {
  type: "object",
  required: [
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

const createParentSubscriptionBody = {
  type: "object",
  required: ["subcription_billing_frequency", "no_of_beneficiaries", "subscription_status", "beneficiaries"],
  properties: {
    subcription_billing_frequency: {
      type: "string",
      enum: ["monthly", "quarterly", "annually"],
    },
    no_of_beneficiaries: { type: "number", minimum: 1 },
    subscription_status: {
      type: "string",
      enum: ["active", "inactive", "suspended", "canceled", "churned"],
    },
    beneficiaries: {
      type: "array",
      minItems: 1,
      items: subscriptionBeneficiaryOnCreate,
    },
  },
} as const;

const parentSubscriptionRowSchema = {
  type: "object",
  properties: {
    subcription_date: { type: "string", format: "date-time" },
    subscription_id: { type: "number" },
    subscriber_id: { type: "number" },
    subcription_billing_frequency: { type: "string" },
    no_of_beneficiaries: { type: "number" },
    subscription_expiry_date: { type: "string", format: "date-time" },
    subscription_status: { type: "string" },
    last_update_at: { type: ["string", "null"], format: "date-time" },
    last_update_to: { type: ["string", "null"] },
    last_update_by: { type: ["string", "null"] },
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
  createSubscription: {
    description: "Create subscription for logged-in parent (subscriber_id from token; creates beneficiaries and orders)",
    tags: ["Parent"],
    security: [{ bearerAuth: [] }],
    body: createParentSubscriptionBody,
    response: {
      201: {
        type: "object",
        properties: { ...baseResponse, data: parentSubscriptionRowSchema },
      },
      400: errorResponse,
      401: errorResponse,
      500: errorResponse,
    },
  } as const,
  listSubscriptions: {
    description: "List subscriptions for logged-in parent (paginated)",
    tags: ["Parent"],
    security: [{ bearerAuth: [] }],
    querystring: paginationQuerystring,
    response: {
      200: {
        type: "object",
        properties: {
          ...baseResponse,
          data: { type: "array", items: parentSubscriptionRowSchema },
          pagination: paginationObject,
        },
      },
      401: errorResponse,
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
