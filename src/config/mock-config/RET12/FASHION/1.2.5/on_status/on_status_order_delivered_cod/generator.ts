import { SessionData } from "../../../../session-types";
import { createFulfillments } from "../../api-objects/fulfillments";
import { createGenericOnStatus } from "../../api-objects/on_status";

export async function on_status_order_delivered_cod_generator(
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
	generalPayload.message.order.payment = {
		...generalPayload.message.order.payment,
		params: {
			...generalPayload.message.order.payment.params,
			transaction_id: generateSixDigitCode(),
		},
		time: {
			timestamp: new Date().toISOString(),
		},
		status: "PAID",

	};

	return generalPayload;
}

export function generateSixDigitCode(): string {
	return Math.floor(100000 + Math.random() * 900000).toString();
}
