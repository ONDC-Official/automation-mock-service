import { createGenericOnStatus } from "../on_status_order_delivered_rep/generator";

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
        fulfillment.start.time = existingPayload.context.timestamp;
      }
    });
  }
  return generalPayload;
}
