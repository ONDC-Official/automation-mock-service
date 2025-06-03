import { SessionData } from "../../../../session-types";
import { createQuote } from "../../api-objects/breakup";
import { getRandomItem } from "../../on_select/on_select_out_of_stock/generator";

const cancelFulfillment = {
	id: "c_e1ef592c-5ccf-476b-97c8-85f276f07b53_1",
	type: "Cancel",
	state: {
		descriptor: {
			code: "Cancelled",
		},
	},
	tags: [
		{
			code: "cancel_request",
			list: [
				{
					code: "reason_id",
					value: "002",
				},
				{
					code: "initiated_by",
					value: "sellerNP.com",
				},
			],
		},
		{
			code: "quote_trail",
			list: [
				{
					code: "type",
					value: "item",
				},
				{
					code: "id",
					value: "oc_72",
				},
				{
					code: "currency",
					value: "INR",
				},
				{
					code: "value",
					value: "-500",
				},
			],
		},
	],
};

export async function on_update_part_cancel_generator(
	existingPayload: any,
	sessionData: SessionData
) {
	existingPayload.message.order.id = sessionData.order_id;
	existingPayload.message.provider = sessionData.provider;
	existingPayload.message.order.billing = sessionData.billing;
	existingPayload.message.order.payment = sessionData.payment;
	existingPayload.message.order.created_at = sessionData.order_created_at;
	existingPayload.message.order.updated_at = new Date().toISOString();

	const itemsIds = sessionData.items.map((item: any) => item.id) as string[];
	const cancelId = getRandomItem(itemsIds) || "I1";
	const cancelItem = sessionData.items.find(
		(item: any) => item.id === cancelId
	);
	cancelItem.fulfillment_id = cancelFulfillment.id;
	existingPayload.message.order.items = sessionData.items;
	cancelFulfillment.tags[0].list[1].value = existingPayload.context.bpp_id;
	cancelFulfillment.tags[1].list[1].value = cancelId;
	let itemQuote = sessionData.quote.breakup.find(
		(b: any) => b["@ondc/org/item_id"] === cancelId
	);
	let price = itemQuote.price.value;
	cancelFulfillment.tags[1].list[3].value = "-" + price;
	const fulfillments = sessionData.fulfillments;
	fulfillments.push(cancelFulfillment);
	existingPayload.message.order.fulfillments = fulfillments;

	const newItems = sessionData.items
		.filter((item: any) => item.id !== cancelId)
		.map((item: any) => {
			return {
				id: item.id,
				count: item.quantity.count,
			};
		});

	existingPayload.message.order.quote = createQuote(
		newItems,
		sessionData,
		existingPayload
	);
	return existingPayload;
}
