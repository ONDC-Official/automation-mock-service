import { SessionData } from "../../../../session-types";
import { Quote } from "../../api-objects/breakup-type";
import { Fulfillments } from "../../api-objects/fulfillments";

export async function on_cancel_return_request_generator(
	existingPayload: any,
	sessionData: SessionData
) {
	const savedItems = JSON.parse(JSON.stringify(sessionData.items));
	const cancelItems = sessionData.items.map((item: any) => {
		const ob = {
			id: item.id,
			quantity: {
				count: item.quantity.count,
			},
			fulfillment_id: "cancel_id_8189",
		};
		item.quantity.count = 0;
		return ob;
	});
	existingPayload.message.order.items = [...sessionData.items, ...cancelItems];
	existingPayload.message.order.provider = sessionData.provider;
	existingPayload.message.order.billing = sessionData.billing;
	existingPayload.message.order.fulfillments = createCancelFulfillments(
		sessionData.quote,
		sessionData.fulfillments,
		sessionData
	);
	existingPayload.message.order.payment = sessionData.payment;
	existingPayload.message.order.id = sessionData.order_id;
	existingPayload.message.order.created_at = sessionData.order_created_at;
	existingPayload.message.order.updated_at = new Date().toISOString();
	existingPayload.message.order.cancellation = {
		cancelled_by: existingPayload.context.bap_id,
		reason: {
			id: sessionData.cancellation_reason_id,
		},
	};
	existingPayload.message.order.quote = sessionData.quote;
	return existingPayload;
}

function createCancelFulfillments(
	quote: any,
	fulfillments: Fulfillments,
	sessionData: SessionData
) {
	fulfillments = fulfillments.map((f) => {
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
						}
						,{
							code: "reason_id",
							value: sessionData.cancellation_reason_id,
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
							value: "Return_Initiated",
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
		tags: createQuoteTrail(quote),
	});
	return fulfillments;
}

function createQuoteTrail(quote: Quote) {
	const tags: any = [];
	const breakup = quote.breakup || [];
	for (const item of breakup) {
		const priceStr = item.price?.value || "0.00";
		const priceValue = parseFloat(priceStr);
		if (item["@ondc/org/item_quantity"]) {
			item["@ondc/org/item_quantity"].count = 0;
		}
		if (priceValue !== 0) {
			const trail = JSON.parse(JSON.stringify(sampleQuoteTrail));
			trail.list[0].value = item["@ondc/org/title_type"] || "misc";
			trail.list[1].value = item["@ondc/org/item_id"] || "unknown";
			trail.list[2].value = item.price?.currency || "INR";
			trail.list[3].value = (-1 * priceValue).toFixed(2);
			tags.push(trail);
			if (item.price) {
				item.price.value = "0.00";
			}
		}
	}

	return tags;
}

const sampleQuoteTrail = {
	code: "quote_trail",
	list: [
		{
			code: "type",
			value: "misc",
		},
		{
			code: "id",
			value: "c4b2dd74-9ccd-4ec1-b8f8-58d36dd8ce33",
		},
		{
			code: "currency",
			value: "INR",
		},
		{
			code: "value",
			value: "-100.00",
		},
	],
};
