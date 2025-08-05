import { SessionData } from "../../../../session-types";
import { createFulfillments } from "../../api-objects/fulfillments";
import { createGenericOnStatus } from "../../api-objects/on_status";
import { removeItemQuantitiesFromQuote } from "../../api-objects/quotes";

export async function on_status_pending_generator(
  existingPayload: any,
  sessionData: SessionData
) {
  console.log("object 1", JSON.stringify(sessionData.items));
  const generalPayload = createGenericOnStatus(existingPayload, sessionData);
  generalPayload.message.order.fulfillments = createFulfillments(
    "on_status",
    "on_status_accepted",
    sessionData,
    generalPayload.message.order.fulfillments
  );
  generalPayload.message.order.updated_at = existingPayload.context.timestamp;

  if (sessionData.update_payment) {
    generalPayload.message.order.payment = sessionData.payment;
    generalPayload.message.order.payment["@ondc/org/settlement_details"].push(
      sessionData.update_payment[0][0]
    );
    sessionData.update_payment = null;
  }
  existingPayload.message.order.quote = removeItemQuantitiesFromQuote(sessionData.quote);

  return generalPayload;
}
