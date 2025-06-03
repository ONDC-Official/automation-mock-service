import { SessionData } from "../../../../session-types";

export async function on_update_interim_reverse_qc_generator(
	existingPayload: any,
	sessionData: SessionData
) {
	existingPayload.message.order.id = sessionData.order_id;
	existingPayload.message.order.provider = sessionData.provider;
	existingPayload.message.order.items = sessionData.items;
	existingPayload.message.order.quote = sessionData.quote;
	existingPayload.message.order.billing = sessionData.billing;
	existingPayload.message.order.fulfillments = [
		...sessionData.fulfillments,
		...sessionData.update_fulfillments,
	];
	existingPayload.message.order.payment = sessionData.payment;
	existingPayload.message.order.created_at = sessionData.order_created_at;
	existingPayload.message.order.updated_at = new Date().toISOString();
	return existingPayload;
}
