import { SessionData } from "../../../../session-types";
import { Quote } from "../../api-objects/breakup-type";
import { Fulfillments } from "../../api-objects/fulfillments";

export async function on_cancel_return_request_generator(
	existingPayload: any,
	sessionData: SessionData
) {
	const savedItems = JSON.parse(JSON.stringify(sessionData.items));
	existingPayload.message.order.items = [...sessionData.items];
	existingPayload.message.order.provider = sessionData.provider;
	existingPayload.message.order.billing = sessionData.billing;
	existingPayload.message.order.fulfillments = createCancelReturnRequestFulfillments(
		sessionData.quote,
		sessionData.fulfillments,
		sessionData
	);
	existingPayload.message.order.payment = sessionData.payment;
	existingPayload.message.order.id = sessionData.order_id;
	existingPayload.message.order.created_at = sessionData.order_created_at;
	existingPayload.message.order.updated_at = new Date().toISOString();
	existingPayload.message.order.quote = sessionData.quote;
	return existingPayload;
}

function createCancelReturnRequestFulfillments(
	quote: any,
	fulfillments: Fulfillments,
	sessionData: SessionData
) {
	const returnFulfillments = fulfillments.filter(f => f.type === "Return");
	
	fulfillments = fulfillments.map(f => {
		if (f.type !== "Return") return f;
		const precancel_state = f.state?.descriptor?.code || "Return_Initiated";
		const tags = f.tags || [];
		return {
			...f,
			state: {
				descriptor: {
					code: "Cancelled",
				},
			},
			tags: [
				...tags,
				{
					code: "cancel_request",
					list: [
						{
							code: "id",
							value: "CR1"
						},
						{
							code: "reason_id",
							value: sessionData.cancellation_return_reason_id,
						},
						{
							code: "initiated_by",
							value: sessionData.bap_id || "bap",
						},
					],
				},
				{
					code: "precancel_state",
					list: [
						{
							code: "fulfillment_state",
							value: precancel_state,
						},
						{
							code: "updated_at",
							value: sessionData.last_updated_at || new Date().toISOString(),
						},
					],
				},
			],
		};
	});
	fulfillments.push({
		id: "CR1",
		type: "Cancel",
		state: {
			descriptor: {
				code: "Cancelled",
			},
		},
	});
	return fulfillments;
}
