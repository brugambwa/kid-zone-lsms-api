import { baseResponse, errorResponse, paginationQuerystring, paginationObject } from "./global.schema";

const subscriberOrderSchema = {} as const;

//Reusable Response Schemas
const successResponseSingle = {
  type: "object",
  properties: {
    ...baseResponse,
    data: subscriberOrderSchema,
  },
} as const;

const successResponseList = {
  type: "object",
  properties: {
    ...baseResponse,
    data: {
      oneOf: [
        subscriberOrderSchema,
        { type: "array", items: subscriberOrderSchema },
        { type: "null" },
        { type: "array", items: {} },
      ],
    },
    pagination: paginationObject,
  },
} as const;

const subscriberOrderIdParam = {
  type: "object",
  required: ["subscriber_order_id"],
  properties: {
    subscriber_order_id: {
      type: "string",
      pattern: String.raw`^[1-9][0-9]*$`,
      description: "Subscriber Order ID",
    },
  },
} as const;

// Route Validation Schemas.
const getAllSubscriberOrdersSchema = {
  description: "Get all subscriber orders with pagination",
  tags: ["Subscriber Orders"],
  querystring: paginationQuerystring,
  response: {
    200: successResponseList,
    404: errorResponse,
  },
};

const getByOrderIDSchema = {
  description: "Get a subscriber order by its ID",
  tags: ["Subscriber Orders"],
  params: subscriberOrderIdParam,
  response: {
    200: successResponseSingle,
    404: errorResponse,
  },
};

const getBySubscriberIDSchema = {
  description: "Get subscriber orders by subscriber ID with pagination",
  tags: ["Subscriber Orders"],
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
    404: errorResponse,
  },
};

const getByBeneficiaryIDSchema = {
  description: "Get subscriber orders by beneficiary ID",
  tags: ["Subscriber Orders"],
  params: {
    type: "object",
    required: ["beneficiary_id"],
    properties: {
      beneficiary_id: {
        type: "string",
        pattern: String.raw`^[1-9][0-9]*$`,
        description: "Beneficiary ID",
      },
    },
  },
  response: {
    200: successResponseList,
    404: errorResponse,
  },
};

const getByStatusSchema = {
  description: "Get subscriber orders by order  status with pagination",
  tags: ["Subscriber Orders"],
  params: {
    type: "object",
    required: ["order_status"],
    properties: {
      order_status: {
        type: "string",
        enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
        description: "Order status",
      },
    },
  },
  querystring: paginationQuerystring,
  response: {
    200: successResponseList,
    404: errorResponse,
  },
};

export const subscriberOrdersSchemas = {
  getByOrderID: getByOrderIDSchema,
  getAllOrders: getAllSubscriberOrdersSchema,
  getBySubscriberID: getBySubscriberIDSchema,
  getByBeneficiaryID: getByBeneficiaryIDSchema,
  getByStatus: getByStatusSchema,
};
