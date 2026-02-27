import { FastifyInstance } from "fastify";
import { asyncWrapper } from "../middleware/async.wrapper";
import { errorHandler } from "../utils/error.handler";
import { parseIntParam } from "../utils/param.parser";
import { BeneficiariesController } from "../controllers/beneficiaries.controller";
import { beneficiarySchemas } from "../schemas/beneficiaries.schema";

export async function beneficiariesRoutes(fastify: FastifyInstance) {
  const beneficiaries = new BeneficiariesController();

  fastify.setErrorHandler(errorHandler);

  fastify.post(
    "/",
    { schema: beneficiarySchemas.createBeneficiary },
    asyncWrapper(beneficiaries.createSubscriptionBeneficiary.bind(beneficiaries)),
  );
  fastify.get(
    "/",
    { schema: beneficiarySchemas.getAll },
    asyncWrapper(beneficiaries.getAllBeneficiaries.bind(beneficiaries)),
  );
  fastify.get(
    "/beneficiary/:beneficiary_id",
    { schema: beneficiarySchemas.getByBeneficiaryID, preHandler: [parseIntParam("beneficiary_id")] },
    asyncWrapper(beneficiaries.getByBeneficiaryID.bind(beneficiaries)),
  );
  fastify.get(
    "/subscriber/:subscriber_id",
    { schema: beneficiarySchemas.getBySubscriberID, preHandler: [parseIntParam("subscriber_id")] },
    asyncWrapper(beneficiaries.getBySubscriberID.bind(beneficiaries)),
  );
  fastify.get(
    "/subscription/:subscription_id",
    { schema: beneficiarySchemas.getBySubscriptionID, preHandler: [parseIntParam("subscription_id")] },
    asyncWrapper(beneficiaries.getBySubscriptionID.bind(beneficiaries)),
  );
  fastify.get(
    "/link-status",
    { schema: beneficiarySchemas.getByLinkStatus },
    asyncWrapper(beneficiaries.getByLinkStatus.bind(beneficiaries)),
  );
  fastify.put(
    "/:beneficiary_id",
    { schema: beneficiarySchemas.updateBeneficiary, preHandler: [parseIntParam("beneficiary_id")] },
    asyncWrapper(beneficiaries.updateSubscriptionBeneficiary.bind(beneficiaries)),
  );
  fastify.delete(
    "/:beneficiary_id",
    { schema: beneficiarySchemas.deleteBeneficiary, preHandler: [parseIntParam("beneficiary_id")] },
    asyncWrapper(beneficiaries.deleteSubscriptionBeneficiary.bind(beneficiaries)),
  );
}
