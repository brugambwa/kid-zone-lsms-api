import { baseResponse, errorResponse, paginationQuerystring, paginationObject } from "./global.schema";

const subscriberSchema = {
  type: "object",
  properties: {
    date_created: { type: "string", format: "date-time" },
    subscriber_id: { type: "number" },
    first_name: { type: "string", maxLength: 255 },
    last_name: { type: "string", maxLength: 255 },
    telephone_number: {
      type: "string",
      minLength: 10,
      maxLength: 15,
      pattern: String.raw`^\+?[0-9]{10,15}$`,
      description:
        "Subscriber's telephone number, can include country code and should be between 10 to 15 digits",
    },
    email_address: { type: "string", format: "email", description: "Subscriber's email address" },
    village_id: { type: "number" },
    home_address: { type: "string", maxLength: 255 },
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
    data: subscriberSchema,
  },
} as const;

const successResponseList = {
  type: "object",
  properties: {
    ...baseResponse,
    data: {
      oneOf: [
        subscriberSchema,
        { type: "array", items: subscriberSchema },
        { type: "null" },
        { type: "array", items: {} },
      ],
    },
    pagination: paginationObject,
  },
} as const;

const subscriberIdParam = {
  type: "object",
  required: ["subscriber_id"],
  properties: {
    subscriber_id: {
      type: "string",
      pattern: String.raw`^[1-9][0-9]*$`,
      description: "Subscriber ID",
    },
  },
} as const;

// Route Validation Schemas.
const createSubscriberSchema = {
  description: "Create a new subscriber",
  tags: ["Subscribers"],
  body: {
    type: "object",
    required: ["first_name", "last_name", "email_address", "village_id", "home_address"],
    properties: {
      first_name: subscriberSchema.properties.first_name,
      last_name: subscriberSchema.properties.last_name,
      telephone_number: subscriberSchema.properties.telephone_number,
      email_address: subscriberSchema.properties.email_address,
      village_id: subscriberSchema.properties.village_id,
      home_address: subscriberSchema.properties.home_address,
    },
  },
  response: {
    201: successResponseSingle,
    400: errorResponse,
    500: errorResponse,
  },
} as const;

const getAllSubscribersSchema = {
  description: "Get all subscribers with optional pagination",
  tags: ["Subscribers"],
  querystring: paginationQuerystring,
  response: {
    200: successResponseList,
    400: errorResponse,
    500: errorResponse,
  },
} as const;
const getSubscriberByIDSchema = {
  description: "Get a subscriber by ID",
  tags: ["Subscribers"],
  params: subscriberIdParam,
  response: {
    200: successResponseSingle,
    400: errorResponse,
    404: errorResponse,
    500: errorResponse,
  },
} as const;

const getSubscriberByEmailSchema = {
  description: "Get a subscriber by email address",
  tags: ["Subscribers"],
  params: {
    type: "object",
    required: ["email"],
    properties: {
      email: subscriberSchema.properties.email_address,
    },
  },
  response: {
    200: successResponseSingle,
    400: errorResponse,
    404: errorResponse,
    500: errorResponse,
  },
} as const;

const updateSubscriberSchema = {
  description: "Update an existing subscriber",
  tags: ["Subscribers"],
  params: subscriberIdParam,
  body: {
    type: "object",
    properties: {
      first_name: subscriberSchema.properties.first_name,
      last_name: subscriberSchema.properties.last_name,
      telephone_number: subscriberSchema.properties.telephone_number,
      email_address: subscriberSchema.properties.email_address,
      village_id: subscriberSchema.properties.village_id,
      home_address: subscriberSchema.properties.home_address,
    },
  },
  response: {
    200: successResponseSingle,
    400: errorResponse,
    404: errorResponse,
    500: errorResponse,
  },
} as const;

const deleteSubscriberSchema = {
  description: "Delete a subscriber by ID",
  tags: ["Subscribers"],
  params: subscriberIdParam,
  response: {
    200: successResponseSingle,
    400: errorResponse,
    404: errorResponse,
    500: errorResponse,
  },
} as const;

export const subscriberSchemas = {
  createSubscriber: createSubscriberSchema,
  getAllSubscribers: getAllSubscribersSchema,
  getSubscriberByID: getSubscriberByIDSchema,
  getSubscriberByEmail: getSubscriberByEmailSchema,
  updateSubscriber: updateSubscriberSchema,
  deleteSubscriber: deleteSubscriberSchema,
};
