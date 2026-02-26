import { FulfillmentItems } from "@prisma/client";

export interface FulfillmentItemsRepository {
  createFulfillmentItems(
    fulfillmentItems: Omit<FulfillmentItems, "record_id" | "date_created">,
  ): Promise<FulfillmentItems>;
  getFulfillmentItemsByFulfillmentId(fulfillmentId: number): Promise<FulfillmentItems[]>;
  getFulfillmentItemsByBeneficiaryId(beneficiaryId: number): Promise<FulfillmentItems[]>;
}
