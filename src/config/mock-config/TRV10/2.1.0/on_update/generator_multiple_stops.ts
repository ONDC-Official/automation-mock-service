import { SessionData } from "../../session-types";

export async function onUpdateMultipleStopsGenerator(
  existingPayload: any,
  sessionData: SessionData
) {
  if (sessionData.payments.length > 0) {
    existingPayload.message.order.payments = sessionData.payments;
  }

  if (sessionData.items.length > 0) {
    existingPayload.message.order.items = sessionData.items;
  }

  if (sessionData.fulfillments.length > 0) {
    existingPayload.message.order.fulfillments =
      sessionData.selected_fulfillments;
    existingPayload.message.order.fulfillments[0]["type"] = "DELIVERY";

    const fulfillments = existingPayload.message.order.fulfillments;

    existingPayload.message.order.fulfillments = fulfillments.map(
      (fulfillment: any, index: number) => {
        fulfillment.id =
          sessionData?.selected_fulfillments[index]?.id || index + 1;
        return fulfillment;
      }
    );
  }
  if (sessionData.order_id) {
    existingPayload.message.order.id = sessionData.order_id;
  }
  if (sessionData.quote != null) {
    existingPayload.message.order.quote = sessionData.quote;
  }
  const now = new Date().toISOString();
  existingPayload.message.order.created_at = sessionData.created_at;
  existingPayload.message.order.updated_at = now;
  if (sessionData.payments.length > 0) {
    existingPayload.message.order.payments = sessionData.payments;
  }
  return existingPayload;
}
