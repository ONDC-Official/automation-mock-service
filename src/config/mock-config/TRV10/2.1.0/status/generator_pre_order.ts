import { SessionData } from "../../session-types";

export async function statusPreOrderGenerator(
  existingPayload: any,
  sessionData: SessionData
) {
  existingPayload.message.ref_id = existingPayload.context.transaction_id;
  delete existingPayload.message.order_id;
  return existingPayload;
}
