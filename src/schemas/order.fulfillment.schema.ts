import { baseResponse, errorResponse, paginationQuerystring, paginationObject } from "./global.schema";
import { fulfillment_status } from "@prisma/client";

const fulfillmentSchema = {
  type: "object",
  properties: {
    fulfillment_id: { type: "number" },
    order_id: { type: "number" },
    notes: { type: "string", nullable: true },
    fulfillment_status: { type: "string", enum: Object.values(fulfillment_status) },
    date_created: { type: "string", format: "date-time" },
    last_update_by: { type: "string", maxLength: 255, nullable: true },
    last_update_to: { type: "string", maxLength: 255, nullable: true },
    last_update_at: { type: "string", format: "date-time", nullable: true },
  },
} as const;

//Reusable Response Schemas
const successResponseSingle = {
  type: "object",
  properties: {
    ...baseResponse,
    data: fulfillmentSchema,
  },
} as const;

const successResponseList = {
  type: "object",
  properties: {
    ...baseResponse,
    data: {
      oneOf: [
        fulfillmentSchema,
        { type: "array", items: fulfillmentSchema },
        { type: "null" },
        { type: "array", items: {} },
      ],
    },
    pagination: paginationObject,
  },
} as const;

// Route Validation Schemas.
const createFulfillmentSchema = {
  description: "Create a new fulfillment for an order",
  tags: ["Order Fulfillment"],
  body: {
    type: "object",
    required: ["order_id", "fulfillment_status"],
    properties: {
      order_id: fulfillmentSchema.properties.order_id,
      beneficiary_id: { type: "number" },
      notes: fulfillmentSchema.properties.notes,
      fulfillment_date: { type: "string", format: "date-time", nullable: true },
      expected_return_date: { type: "string", format: "date-time", nullable: true },
      fulfillment_status: fulfillmentSchema.properties.fulfillment_status,
      fulfillment_items: {
        type: "array",
        items: {
          type: "object",
          properties: {
            book_isbn: { type: "string" },
          },
          required: ["book_isbn"],
          additionalProperties: false,
        },
      },
    },
    additionalProperties: false,
  },
  response: {
    201: successResponseSingle,
    400: errorResponse,
  },
} as const;

const getByIDSchema = {
  description: "Get order fulfillment details by ID",
  tags: ["Order Fulfillment"],
  params: {
    type: "object",
    required: ["fulfillment_id"],
    properties: {
      fulfillment_id: { type: "number" },
    },
  },
  response: {
    200: successResponseSingle,
    404: errorResponse,
  },
} as const;

const getAllSchema = {
  description: "Get a list of all order fulfillments with pagination",
  tags: ["Order Fulfillment"],
  querystring: paginationQuerystring,
  response: {
    200: successResponseList,
    400: errorResponse,
  },
} as const;

const getByOrderIDSchema = {
  description: "Get order fulfillments by Order ID with pagination",
  tags: ["Order Fulfillment"],
  params: {
    type: "object",
    required: ["order_id"],
    properties: {
      order_id: { type: "number" },
    },
  },
  querystring: paginationQuerystring,
  response: {
    200: successResponseList,
    400: errorResponse,
  },
} as const;

const getByStatusSchema = {
  description: "Get order fulfillments by fulfillment status with pagination",
  tags: ["Order Fulfillment"],
  params: {
    type: "object",
    required: ["fulfillment_status"],
    properties: {
      fulfillment_status: { type: "string", enum: Object.values(fulfillment_status) },
    },
  },
  querystring: paginationQuerystring,
  response: {
    200: successResponseList,
    400: errorResponse,
  },
} as const;

const getByFulfillmentDateRangeSchema = {
  description: "Get order fulfillments by fulfillment date range with pagination",
  tags: ["Order Fulfillment"],
  querystring: {
    type: "object",
    required: ["start_date", "end_date"],
    properties: {
      start_date: { type: "string", format: "date-time" },
      end_date: { type: "string", format: "date-time" },
    },
  },
  response: {
    200: successResponseList,
    400: errorResponse,
  },
} as const;

const getByExpectedReturnDateRangeSchema = {
  description: "Get order fulfillments by expected return date range with pagination",
  tags: ["Order Fulfillment"],
  querystring: {
    type: "object",
    required: ["start_date", "end_date"],
    properties: {
      start_date: { type: "string", format: "date-time" },
      end_date: { type: "string", format: "date-time" },
    },
  },
  response: {
    200: successResponseList,
    400: errorResponse,
  },
} as const;

const updateOrderFulfillmentSchema = {
  description: "Update an existing order fulfillment",
  tags: ["Order Fulfillment"],
  params: {
    type: "object",
    required: ["fulfillment_id"],
    properties: {
      fulfillment_id: { type: "number" },
    },
  },
  body: {
    type: "object",
    properties: {
      notes: fulfillmentSchema.properties.notes,
      fulfillment_status: fulfillmentSchema.properties.fulfillment_status,
      expected_return_date: { type: "string", format: "date-time", nullable: true },
    },
    additionalProperties: false,
  },
  response: {
    200: successResponseSingle,
    400: errorResponse,
    404: errorResponse,
  },
} as const;

const deleteOrderFulfillmentSchema = {
  description: "Delete an order fulfillment by ID",
  tags: ["Order Fulfillment"],
  params: {
    type: "object",
    required: ["fulfillment_id"],
    properties: {
      fulfillment_id: { type: "number" },
    },
  },
  response: {
    200: successResponseSingle,
    400: errorResponse,
    404: errorResponse,
  },
} as const;

export const orderFulfillmentSchemas = {
  createFulfillment: createFulfillmentSchema,
  getByID: getByIDSchema,
  getAll: getAllSchema,
  getByOrderID: getByOrderIDSchema,
  getByStatus: getByStatusSchema,
  getByFulfillmentDateRange: getByFulfillmentDateRangeSchema,
  getByExpectedReturnDateRange: getByExpectedReturnDateRangeSchema,
  updateOrderFulfillment: updateOrderFulfillmentSchema,
  deleteOrderFulfillment: deleteOrderFulfillmentSchema,
} as const;
