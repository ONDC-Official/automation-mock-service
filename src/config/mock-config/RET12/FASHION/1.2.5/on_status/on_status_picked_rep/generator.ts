import { createFulfillments } from "../../api-objects/fulfillments";
import { createGenericOnStatus } from "../../api-objects/on_status";

export async function on_status_picked_rep_generator(
  existingPayload: any,
  sessionData: any
) {
  const generalPayload = createGenericOnStatus(existingPayload, sessionData);
  const replacementId = sessionData.replacementId;
  generalPayload.message.order.fulfillments = sessionData.fulfillments;
  const fulfillments = generalPayload.message?.order?.fulfillments;
  if (Array.isArray(fulfillments)) {
    fulfillments.forEach((fulfillment: any) => {
      if (fulfillment.id === replacementId) {
        fulfillment.state.descriptor.code = "Order-picked-up";
        fulfillment.start.time = new Date().toISOString();
      }
    });
  }
  return generalPayload;
}
