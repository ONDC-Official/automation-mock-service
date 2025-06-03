import { SessionData } from "../../../../session-types";
import { getUpdatedBilling } from "../../api-objects/billing";
import { createFulfillments } from "../../api-objects/fulfillments";

export async function on_init_buyer_delivery_generator(
	existingPayload: any,
	sessionData: SessionData
) {
	existingPayload.message.order.items = sessionData.items;
	existingPayload.message.order.fulfillments = createFulfillments(
		"on_init",
		"on_init_buyer_delivery",
		sessionData,
		existingPayload.message.order.fulfillments
	);
	existingPayload.message.order.billing = getUpdatedBilling(
		sessionData.billing
	);
	existingPayload.message.order.provider = sessionData.provider;
	existingPayload.message.order.quote = sessionData.quote;
	return existingPayload;
}
