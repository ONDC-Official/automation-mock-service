import { SessionData } from "../../session-types";

export async function onStatusMultipleStopsGenerator(
  existingPayload: any,
  sessionData: SessionData
) {
  if (sessionData.payments.length > 0) {
    existingPayload.message.order.payments = sessionData.payments;
  }

  if (sessionData.items.length > 0) {
    existingPayload.message.order.items = sessionData.items;
  }

  if (sessionData?.cancellation_fulfillments.length > 0) {
    existingPayload.message.order.fulfillments =
      sessionData?.cancellation_fulfillments;
  } else if (sessionData.fulfillments.length > 0) {
    existingPayload.message.order.fulfillments =
      sessionData.selected_fulfillments;
  }

  if (sessionData.order_id) {
    existingPayload.message.order.id = sessionData.order_id;
  }

  if (sessionData.cancellation_quote != null) {
    existingPayload.message.order.quote = sessionData?.cancellation_quote;
  } else if (sessionData.quote != null) {
    existingPayload.message.order.quote = sessionData.quote;
  }

  if(sessionData?.cancellation_reason != null) {
    existingPayload.message.order.cancellation = sessionData.cancellation_reason;
  }

  const now = new Date().toISOString();
  existingPayload.message.order.created_at = sessionData.created_at;
  existingPayload.message.order.updated_at = now;
  existingPayload.message.order.provider.id = sessionData.provider_id;
  return existingPayload;
}
