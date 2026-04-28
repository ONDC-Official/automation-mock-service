import { createGenericOnStatus } from "../../api-objects/on_status";

export async function on_status_out_for_delivery_rep_generator(
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
        fulfillment.state.descriptor.code = "Out-for-delivery";
      }
    });
  }
  return generalPayload;
}
