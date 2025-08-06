import { SessionData } from "../../../../session-types";
import { createFulfillments } from "../../api-objects/fulfillments";
import { createGenericOnStatus } from "../../api-objects/on_status";

export async function on_status_agent_assigned_fin_generator(
  existingPayload: any,
  sessionData: SessionData
) {
  const generalPayload = createGenericOnStatus(existingPayload, sessionData);
  generalPayload.message.order.fulfillments = createFulfillments(
    "on_status",
    "on_status_agent_assigned",
    sessionData,
    generalPayload.message.order.fulfillments
  );
  generalPayload.message.order.quote = sessionData.quote;
  generalPayload.message.order.payment = sessionData.payment;
  generalPayload.message.order.tags = sessionData.order_tags;
  return generalPayload;
}
