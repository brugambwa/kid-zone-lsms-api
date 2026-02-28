import { baseResponse, errorResponse, paginationQuerystring, paginationObject } from "./global.schema";

export const beneficiarySchema = {
  type: "object",
  properties: {
    subscriber_id: { type: "number" },
    subscription_id: { type: "number" },
    beneficiary_first_name: { type: "string" },
    beneficiary_last_name: { type: "string" },
    beneficiary_date_of_birth: { type: "string", format: "date" },
    language_preference: { type: "string" },
    subscription_link_active: { type: "string" },
    no_of_books: { type: "number" },
    fullfilment_frequency: { type: "string" },
    fullfilment_start_date: { type: "string", format: "date" },
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
    data: beneficiarySchema,
  },
} as const;

const successResponseList = {
  type: "object",
  properties: {
    ...baseResponse,
    data: {
      oneOf: [
        beneficiarySchema,
        { type: "array", items: beneficiarySchema },
        { type: "null" },
        { type: "array", items: {} },
      ],
    },
    pagination: paginationObject,
  },
} as const;

const beneficiaryIdParam = {
  type: "object",
  required: ["beneficiary_id"],
  properties: {
    beneficiary_id: {
      type: "string",
      pattern: String.raw`^[1-9][0-9]*$`,
      description: "Beneficiary ID",
    },
  },
} as const;

// Route Validation Schemas.
const createBeneficiarySchema = {
  description: "Create a new subscription beneficiary",
  tags: ["Beneficiaries"],
  body: {
    type: "object",
    required: [
      "subscription_id",
      "subscriber_id",
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
      subscription_id: beneficiarySchema.properties.subscription_id,
      subscriber_id: beneficiarySchema.properties.subscriber_id,
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
  response: {
    201: successResponseSingle,
    400: errorResponse,
    500: errorResponse,
  },
} as const;

const getAllBeneficiariesSchema = {
  description: "Get all subscription beneficiaries with pagination",
  tags: ["Beneficiaries"],
  querystring: paginationQuerystring,
  response: {
    200: successResponseList,
    400: errorResponse,
    500: errorResponse,
  },
} as const;

const getByBeneficiaryIDSchema = {
  description: "Get subscription beneficiaries by beneficiary ID",
  tags: ["Beneficiaries"],
  params: beneficiaryIdParam,
  response: {
    200: successResponseList,
    400: errorResponse,
    500: errorResponse,
  },
} as const;

const getBySubscriberIDSchema = {
  description: "Get subscription beneficiaries by subscriber ID",
  tags: ["Beneficiaries"],
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
  response: {
    200: successResponseList,
    400: errorResponse,
    500: errorResponse,
  },
} as const;

const getBySubscriptionIDSchema = {
  description: "Get subscription beneficiaries by subscription ID",
  tags: ["Beneficiaries"],
  params: {
    type: "object",
    required: ["subscription_id"],
    properties: {
      subscription_id: {
        type: "string",
        pattern: String.raw`^[1-9][0-9]*$`,
        description: "Subscription ID",
      },
    },
  },
  response: {
    200: successResponseList,
    400: errorResponse,
    500: errorResponse,
  },
} as const;

const getByLinkStatusSchema = {
  description: "Get subscription beneficiaries by subscription link active status with pagination",
  tags: ["Beneficiaries"],
  querystring: {
    type: "object",
    required: ["subscription_link_active"],
    properties: {
      subscription_link_active: {
        type: "string",
        enum: ["active", "inactive"],
        description: "Subscription link active status",
      },
      ...paginationQuerystring.properties,
    },
  },
  response: {
    200: successResponseList,
    400: errorResponse,
    500: errorResponse,
  },
} as const;

const updateBeneficiarySchema = {
  description: "Update subscription beneficiary by ID",
  tags: ["Beneficiaries"],
  params: beneficiaryIdParam,
  body: {
    type: "object",
    properties: {
      beneficiary_first_name: beneficiarySchema.properties.beneficiary_first_name,
      beneficiary_last_name: beneficiarySchema.properties.beneficiary_last_name,
      beneficiary_date_of_birth: beneficiarySchema.properties.beneficiary_date_of_birth,
      language_preference: beneficiarySchema.properties.language_preference,
      subscription_link_active: beneficiarySchema.properties.subscription_link_active,
    },
  },
  response: {
    200: successResponseSingle,
    400: errorResponse,
    500: errorResponse,
  },
} as const;

const deleteBeneficiarySchema = {
  description: "Delete subscription beneficiary by ID",
  tags: ["Beneficiaries"],
  params: beneficiaryIdParam,
  response: {
    200: {
      type: "object",
      properties: {
        ...baseResponse,
        data: {
          type: "null",
        },
      },
    },
    400: errorResponse,
    500: errorResponse,
  },
} as const;

export const beneficiarySchemas = {
  createBeneficiary: createBeneficiarySchema,
  getAll: getAllBeneficiariesSchema,
  getByBeneficiaryID: getByBeneficiaryIDSchema,
  getBySubscriberID: getBySubscriberIDSchema,
  getBySubscriptionID: getBySubscriptionIDSchema,
  getByLinkStatus: getByLinkStatusSchema,
  updateBeneficiary: updateBeneficiarySchema,
  deleteBeneficiary: deleteBeneficiarySchema,
};
