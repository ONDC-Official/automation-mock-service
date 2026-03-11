import { SessionData } from "../../../../session-types";
import { createFulfillments } from "../../api-objects/fulfillments";
import { createGenericOnStatus } from "../../api-objects/on_status";

export async function on_status_pending_generator(
  existingPayload: any,
  sessionData: SessionData
) {
  console.log("on_status_pending_generator called");
  const generalPayload = createGenericOnStatus(existingPayload, sessionData);
  generalPayload.message.order.fulfillments = createFulfillments(
    "on_status",
    "on_status_accepted",
    sessionData,
    generalPayload.message.order.fulfillments
  );

  console.log(
      "update_payment found:",
      JSON.stringify(sessionData.update_payment, null, 2)
    );

  if (sessionData.update_payment) {
    generalPayload.message.order.payment = sessionData.payment;
    generalPayload.message.order.payment["@ondc/org/settlement_details"].push(
      sessionData.update_payment[0][0]
    );
    console.log(
      "Payment after settlement update:",
      JSON.stringify(generalPayload.message.order.payment, null, 2)
    );
    sessionData.update_payment = null;
  }
  generalPayload.message.order.updated_at = existingPayload.context.timestamp;

  return generalPayload;
}

