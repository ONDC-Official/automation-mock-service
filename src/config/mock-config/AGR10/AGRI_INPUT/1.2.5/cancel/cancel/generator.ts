import { SessionData } from "../../../../session-types";

export async function cancel_generator(
	existingPayload: any,
	sessionData: SessionData
) {
	existingPayload.message.order_id = sessionData.order_id;
	return existingPayload;
}
