// REUSABLE PARAMETER SCHEMAS

const baseResponse = {
  success: { type: "boolean" },
  resp_code: { type: "number" },
  resp_msg: { type: "string" },
} as const;

const errorResponse = {
  type: "object",
  properties: {
    ...baseResponse,
    error: { type: "string" },
  },
} as const;

const paginationObject = {
  type: "object",
  properties: {
    page: { type: "integer" },
    limit: { type: "integer" },
    total: { type: "integer" },
    totalPages: { type: "integer" },
  },
} as const;

const paginationQuerystring = {
  type: "object",
  properties: {
    page: {
      anyOf: [
        { type: "string", pattern: String.raw`^[1-9][0-9]*$` },
        { type: "integer", minimum: 1 },
        { type: "null" },
      ],
      default: 1,
    },
    limit: {
      anyOf: [
        { type: "string", pattern: String.raw`^[1-9][0-9]*$` },
        { type: "integer", minimum: 1, maximum: 100 },
        { type: "null" },
      ],
      default: 10,
    },
  },
} as const;

export { baseResponse, errorResponse, paginationObject, paginationQuerystring };
