import { Decimal } from "@prisma/client/runtime/library";

export function serializePrimitives(value: any): any {
  let result = value;

  if (value === null || value === undefined) {
    // leave result as is
  } else if (typeof value === "bigint") {
    result = value.toString();
  } else if (value instanceof Date || value instanceof Decimal) {
    result = value instanceof Date ? value.toISOString() : value.toString();
  } else if (Array.isArray(value)) {
    result = value.map(serializePrimitives);
  } else if (typeof value === "object") {
    result = Object.fromEntries(Object.entries(value).map(([k, v]) => [k, serializePrimitives(v)]));
  }

  return result;
}
