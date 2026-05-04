import { getUpdatedBilling } from "../../../../../../../utils/generic-utils";

export async function on_status_order_delivered_rep_generator(
  existingPayload: any,
  sessionData: any
) {
  const generalPayload = createGenericOnStatus(existingPayload, sessionData);
  const replacementId = sessionData.replacementId;
  generalPayload.message.order.fulfillments = sessionData.fulfillments;
  const fulfillments = generalPayload.message?.order?.fulfillments;
  generalPayload.message.order.state = "Completed";
  if (Array.isArray(fulfillments)) {
    fulfillments.forEach((fulfillment: any) => {
      if (fulfillment.id === replacementId) {
        fulfillment.state.descriptor.code = "Order-delivered";
      }
    });
  }
  return generalPayload;
}

export function createGenericOnStatus(
	existingPayload: any,
	sessionData: any
) {
	console.log(
		'SESATASSSIPN : ', JSON.stringify(sessionData, null, 2)
	);
	
	existingPayload.message.order.id = sessionData.order_id;
	existingPayload.message.order.provider = sessionData.provider;
	existingPayload.message.order.items = sessionData.items;
	existingPayload.message.order.billing = getUpdatedBilling(
		sessionData.billing
	);
	existingPayload.message.order.quote = sessionData.quote;
	existingPayload.message.order.updated_at = existingPayload.context.timestamp;
	existingPayload.message.order.created_at = sessionData.order_created_at;
  existingPayload.message.order.fulfillments[0].end.time = {
    timestamp: existingPayload.context.timestamp,
  };

	existingPayload.message.order.payment = sessionData.payment
	return existingPayload;
}