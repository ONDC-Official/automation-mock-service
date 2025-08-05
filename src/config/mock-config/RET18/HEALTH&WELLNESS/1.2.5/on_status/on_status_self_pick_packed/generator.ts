import { json } from "body-parser";
import { SessionData } from "../../../../session-types";
import { createFulfillments } from "../../api-objects/fulfillments";
import { createGenericOnStatus } from "../on_status_packed/generator";
import jsonpath from "jsonpath";
export async function on_status_self_pickup_packed_generator(
	existingPayload: any,
	sessionData: SessionData
) {
	const generalPayload = createGenericOnStatus(existingPayload, sessionData);
	generalPayload.message.order.state = "In-progress";

	const num = jsonpath.query(
		{ fulfillments: sessionData.fulfillments },
		`$..fulfillments[?(@.type=="Self-Pickup")].end.contact.phone`
	);
	console.log("Phone Number: ", num);

	generalPayload.message.order.fulfillments[0] = {
		...sessionData.fulfillments[0],
		start: {
			instructions: {
				code: "1",
				name: "ONDC order",
				short_desc: num[0] || "1234567890",
			},
			timestamp: new Date().toISOString(),
		},
		state: {
			descriptor: {
				code: "Packed",
			},
		},
	};
	return generalPayload;
}
