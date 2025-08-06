import { SessionData } from "../../../../session-types";
import { getUpdatedBilling } from "../../api-objects/billing";
import { createFulfillments } from "../../api-objects/fulfillments";
import { createGenericOnStatus } from "../../api-objects/on_status";

export async function on_status_packed_fin_generator(
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
	generalPayload.message.order.quote = sessionData.quote;
	generalPayload.message.order.payment = sessionData.payment;
	generalPayload.message.order.state = "In-progress"
	generalPayload.message.order.tags = sessionData.order_tags;
	return generalPayload;
}
