import { SessionData } from "../../../../session-types";
import { createFulfillments } from "../../api-objects/fulfillments";
import { createGenericOnStatus } from "../on_status_packed/generator";

export async function on_status_order_delivered_generator(
	existingPayload: any,
	sessionData: SessionData
) {
	const generalPayload = createGenericOnStatus(existingPayload, sessionData);
	generalPayload.message.order.fulfillments = createFulfillments(
		"on_status",
		"on_status_order_delivered",
		sessionData,
		generalPayload.message.order.fulfillments
	);
	if (sessionData.instructions) {
		console.log("instructions:", sessionData.instructions);

		generalPayload.message.order.fulfillments[0].end.instructions = {
			...sessionData.instructions,
		};

		if (sessionData.instructions.code === "1") {
			generalPayload.message.order.fulfillments[0].end.instructions.authorization = {
				type: "OTP",
				token: "OTP code",
				valid_from: new Date().toISOString(),
				valid_to: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
			};
		}
	}
	return generalPayload;
}
