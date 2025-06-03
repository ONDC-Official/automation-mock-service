import { SessionData } from "../../../../session-types";

export async function on_cancel_generator(
  existingPayload: any,
  sessionData: SessionData
) {
  existingPayload.message.order.items = sessionData.items;
  existingPayload.message.order.provider = sessionData.provider;
  existingPayload.message.order.billing = sessionData.billing;
  existingPayload.message.order.fulfillments = sessionData.fulfillments;
  existingPayload.message.order.quote = sessionData.quote;
  existingPayload.message.order.payment = sessionData.payment;
  existingPayload.message.order.id = sessionData.order_id;
  existingPayload.message.order.created_at = sessionData.order_created_at;
  existingPayload.message.order.updated_at = new Date().toISOString();
  existingPayload.message.order.cancellation = {
    cancelled_by: existingPayload.context.bap_id,
    reason: {
      id: sessionData.cancellation_reason_id ?? "013",
    },
  };
  return existingPayload;
}
