import { SessionData } from "../../../../session-types";
import { createFulfillments } from "../../api-objects/fulfillments";
import { createGenericOnStatus } from "../../api-objects/on_status";

export async function on_status_order_delivered_fin_generator(
  existingPayload: any,
  sessionData: SessionData
) {
  const generalPayload = createGenericOnStatus(existingPayload, sessionData);
  generalPayload.message.order.fulfillments = createFulfillments(
    "on_status",
    "on_status_order_delivered",
    sessionData,
    generalPayload.message.order.fulfillments
  );
  generalPayload.message.order.state = "Completed";
	generalPayload.message.order.items = sessionData.order_items
  generalPayload.message.order.quote = sessionData.quote;
  generalPayload.message.order.payment = sessionData.payment;
  generalPayload.message.order.tags = sessionData.order_tags;
  generalPayload.message.order.fulfillments[0].end.time.timestamp = existingPayload.context.timestamp;
  return generalPayload;
}
