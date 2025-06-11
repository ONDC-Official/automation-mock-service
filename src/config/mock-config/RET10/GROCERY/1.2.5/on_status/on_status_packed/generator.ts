import { SessionData } from "../../../../session-types";
import { getUpdatedBilling } from "../../api-objects/billing";
import { createFulfillments } from "../../api-objects/fulfillments";

export async function on_status_packed_generator(
	existingPayload: any,
	sessionData: SessionData
) {
	const generalPayload = createGenericOnStatus(existingPayload, sessionData);
	generalPayload.message.order.fulfillments = createFulfillments(
		"on_status",
		"on_status_packed",
		sessionData,
		generalPayload.message.order.fulfillments
	);
	return generalPayload;
}

export function createGenericOnStatus(
	existingPayload: any,
	sessionData: SessionData
) {
	existingPayload.message.order.id = sessionData.order_id;
	existingPayload.message.order.provider = sessionData.provider;
	existingPayload.message.order.items = sessionData.items;
	existingPayload.message.order.billing = getUpdatedBilling(
		sessionData.billing
	);
	// existingPayload.message.order.fulfillments = sessionData.fulfillments;
	existingPayload.message.order.quote = sessionData.quote;
	const timeISO = new Date().toISOString();
	existingPayload.message.order.updated_at = timeISO;
	existingPayload.message.order.created_at = sessionData.order_created_at;
	existingPayload.message.order.payment = sessionData.payment;
	return existingPayload;
}
