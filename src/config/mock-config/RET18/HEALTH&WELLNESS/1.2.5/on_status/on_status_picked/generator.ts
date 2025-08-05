import { SessionData } from "../../../../session-types";
import { createFulfillments } from "../../api-objects/fulfillments";
import { createGenericOnStatus } from "../../api-objects/on_status";

export async function on_status_picked_generator(
  existingPayload: any,
  sessionData: SessionData
) {
  const generalPayload = createGenericOnStatus(existingPayload, sessionData);
  console.log("sessionData.on_status_fulfillments", JSON.stringify(sessionData.on_status_fulfillments))
  generalPayload.message.order.fulfillments = createFulfillments(
    "on_status",
    "on_status_picked",
    sessionData,
    generalPayload.message.order.fulfillments
  );

  console.log("generalPayload", JSON.stringify(generalPayload))
  console.log("sessionData 2", JSON.stringify(sessionData))
  generalPayload.message.order.updated_at = existingPayload.context.timestamp;
  generalPayload.message.order.fulfillments[0].start.time.timestamp =  existingPayload.context.timestamp;
  return generalPayload;
}
