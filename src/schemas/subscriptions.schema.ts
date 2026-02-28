import { baseResponse, errorResponse, paginationQuerystring, paginationObject } from "./global.schema";
import { beneficiarySchema } from "./beneficiaries.schema";

const subscriptionSchema = {
  type: "object",
  properties: {
    subcription_date: { type: "string", format: "date-time" },
    subscription_id: { type: "number" },
    subscriber_id: { type: "number" },
    subcription_billing_frequency: { type: "string", maxLength: 255 },
    no_of_beneficiaries: { type: "number" },
    subscription_expiry_date: { type: "string", format: "date-time" },
    subscription_status: { type: "string", maxLength: 255 },
    last_update_at: { type: ["string", "null"], format: "date-time" },
    last_update_to: { type: ["string", "null"] },
    last_update_by: { type: ["string", "null"] },
  },
} as const;

//Reusable Response Schemas
const successResponseSingle = {
  type: "object",
  properties: {
    ...baseResponse,
    data: subscriptionSchema,
  },
} as const;

const successResponseList = {
  type: "object",
  properties: {
    ...baseResponse,
    data: {
      oneOf: [
        subscriptionSchema,
        { type: "array", items: subscriptionSchema },
        { type: "null" },
        { type: "array", items: {} },
      ],
    },
    pagination: paginationObject,
  },
} as const;

const subscriptionIdParam = {
  type: "object",
  required: ["subscription_id"],
  properties: {
    subscription_id: {
      type: "string",
      pattern: String.raw`^[1-9][0-9]*$`,
      description: "Subscription ID",
    },
  },
} as const;

// Route Validation Schemas.
const createSubscriptionSchema = {
  description: "Create a new subscription",
  tags: ["Subscriptions"],
  body: {
    type: "object",
    required: [
      "subscriber_id",
      "subcription_billing_frequency",
      "no_of_beneficiaries",
      "subscription_status",
      "beneficiaries",
    ],
    properties: {
      subscriber_id: subscriptionSchema.properties.subscriber_id,
      subcription_billing_frequency: subscriptionSchema.properties.subcription_billing_frequency,
      no_of_beneficiaries: subscriptionSchema.properties.no_of_beneficiaries,
      subscription_status: subscriptionSchema.properties.subscription_status,
      beneficiaries: {
        type: "array",
        minItems: 1,
        items: {
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
            beneficiary_first_name: beneficiarySchema.properties.beneficiary_first_name,
            beneficiary_last_name: beneficiarySchema.properties.beneficiary_last_name,
            beneficiary_date_of_birth: beneficiarySchema.properties.beneficiary_date_of_birth,
            language_preference: beneficiarySchema.properties.language_preference,
            subscription_link_active: beneficiarySchema.properties.subscription_link_active,
            no_of_books: beneficiarySchema.properties.no_of_books,
            fullfilment_frequency: beneficiarySchema.properties.fullfilment_frequency,
            fullfilment_start_date: beneficiarySchema.properties.fullfilment_start_date,
          },
        },
      },
    },
  },
  response: {
    201: successResponseSingle,
    400: errorResponse,
  },
} as const;

const getByIDSchema = {
  description: "Get subscription by ID",
  tags: ["Subscriptions"],
  params: subscriptionIdParam,
  response: {
    200: successResponseSingle,
    404: errorResponse,
  },
} as const;

const getAllSubscriptionsSchema = {
  description: "Get all subscriptions with pagination",
  tags: ["Subscriptions"],
  querystring: paginationQuerystring,
  response: {
    200: successResponseList,
  },
} as const;

const getBySubscriberIDSchema = {
  description: "Get subscriptions by subscriber ID with pagination",
  tags: ["Subscriptions"],
  params: {
    type: "object",
    required: ["subscriber_id"],
    properties: {
      subscriber_id: {
        type: "string",
        pattern: String.raw`^[1-9][0-9]*$`,
        description: "Subscriber ID",
      },
    },
  },
  querystring: paginationQuerystring,
  response: {
    200: successResponseList,
  },
} as const;

const getByStatusSchema = {
  description: "Get subscriptions by status with pagination",
  tags: ["Subscriptions"],
  querystring: {
    type: "object",
    required: ["subscription_status"],
    properties: {
      subscription_status: {
        type: "string",
        enum: ["active", "inactive", "cancelled", "expired"],
        description: "Subscription status",
      },
      ...paginationQuerystring.properties,
    },
  },
  response: {
    200: successResponseList,
  },
} as const;

const getByFrequencySchema = {
  description: "Get subscriptions by billing frequency with pagination",
  tags: ["Subscriptions"],
  querystring: {
    type: "object",
    required: ["subcription_billing_frequency"],
    properties: {
      subcription_billing_frequency: {
        type: "string",
        enum: ["daily", "weekly", "monthly", "yearly"],
        description: "Subscription billing frequency",
      },
      ...paginationQuerystring.properties,
    },
  },
  response: {
    200: successResponseList,
  },
} as const;

const getByExpiryDateRangeSchema = {
  description: "Get subscriptions by expiry date range with pagination",
  tags: ["Subscriptions"],
  querystring: {
    type: "object",
    required: ["start_date", "end_date"],
    properties: {
      start_date: {
        type: "string",
        format: "date-time",
        description: "Start date for expiry date range filter",
      },
      end_date: {
        type: "string",
        format: "date-time",
        description: "End date for expiry date range filter",
      },
      ...paginationQuerystring.properties,
    },
  },
  response: {
    200: successResponseList,
  },
} as const;

const updateSubscriptionSchema = {
  description: "Update subscription details",
  tags: ["Subscriptions"],
  params: subscriptionIdParam,
  body: {
    type: "object",
    properties: {
      subcription_billing_frequency: subscriptionSchema.properties.subcription_billing_frequency,
      no_of_beneficiaries: subscriptionSchema.properties.no_of_beneficiaries,
      subscription_status: subscriptionSchema.properties.subscription_status,
      subscription_expiry_date: subscriptionSchema.properties.subscription_expiry_date,
    },
  },
  response: {
    200: successResponseSingle,
    400: errorResponse,
    404: errorResponse,
    500: errorResponse,
  },
} as const;

const deleteSubscriptionSchema = {
  description: "Delete a subscription by ID",
  tags: ["Subscriptions"],
  params: subscriptionIdParam,
  response: {
    204: {
      type: "null",
      description: "Subscription deleted successfully",
    },
    400: errorResponse,
    404: errorResponse,
    500: errorResponse,
  },
} as const;

export const subscriptionSchemas = {
  createSubscription: createSubscriptionSchema,
  getByID: getByIDSchema,
  getAll: getAllSubscriptionsSchema,
  getBySubscriberID: getBySubscriberIDSchema,
  getByStatus: getByStatusSchema,
  getByFrequency: getByFrequencySchema,
  getByExpiryDateRange: getByExpiryDateRangeSchema,
  updateSubscription: updateSubscriptionSchema,
  deleteSubscription: deleteSubscriptionSchema,
};
