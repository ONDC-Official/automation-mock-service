import { SessionData } from "../../../../session-types";
import { createFulfillments } from "../../api-objects/fulfillments";
import { createGenericOnStatus } from "../../api-objects/on_status";

export async function on_status_out_for_delivery_ccc_generator(
	existingPayload: any,
	sessionData: SessionData
) {
	const generalPayload = createGenericOnStatus(existingPayload, sessionData);
	generalPayload.message.order.fulfillments = createFulfillments(
		"on_status",
		"on_status_out_for_delivery",
		sessionData,
		generalPayload.message.order.fulfillments
	);
	generalPayload.message.order.fulfillments[0].start.time.timestamp = existingPayload.context.timestamp;
	generalPayload.message.order.updated_at = existingPayload.context.timestamp;
	//generalPayload.context.domain = "ONDC:FFFFF";
	return generalPayload;
}
