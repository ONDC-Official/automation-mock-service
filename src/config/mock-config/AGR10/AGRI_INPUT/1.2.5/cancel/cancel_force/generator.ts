import { SessionData } from "../../../../session-types";

export  function cancel_force_generator(
	existingPayload: any,
	sessionData: SessionData
) {
	// await delay(5000);
	existingPayload.message.order_id = sessionData.order_id;
	return existingPayload;
}
