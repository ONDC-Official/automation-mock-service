import { SessionData } from "../../../../session-types";
import { createQuote } from "../../api-objects/breakup";
import { getRandomItem } from "../../on_select/on_select_out_of_stock/generator";

const cancelFulfillment = {
	id: "part_cancel_id_12391",
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
	existingPayload.message.order.provider = sessionData.provider;
	existingPayload.message.order.billing = sessionData.billing;
	existingPayload.message.order.payment = sessionData.payment;
	existingPayload.message.order.created_at = sessionData.order_created_at;
	existingPayload.message.order.updated_at = new Date().toISOString();

	const itemsIds = sessionData.items.map((item: any) => item.id) as string[];
	const cancelId = getRandomItem(itemsIds) || "I1";
	const cancelItem = sessionData.items.find(
		(item: any) => item.id === cancelId
	);
	const copyItem = JSON.parse(JSON.stringify(cancelItem));
	copyItem.fulfillment_id = cancelFulfillment.id;
	sessionData.items.push(copyItem);
	cancelItem.quantity.count = 0;
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
		// .filter((item: any) => item.id !== cancelId)
		.map((item: any) => {
			return {
				id: item.id,
				count: item.id === cancelId ? 0 : item.quantity.count,
				fulfillment_id: item.fulfillment_id,
			};
		});

	existingPayload.message.order.quote = createQuote(
		newItems,
		sessionData,
		existingPayload,
		fulfillments
	);
	const offerObjects = getOfferObjects(sessionData, newItems);
	if (offerObjects?.length > 0) {
		cancelFulfillment.tags.push(offerObjects[0] as any);
		existingPayload.message.order.quote.breakup.push(offerObjects[1] as any);
	}
	return existingPayload;
}

function getOfferObjects(
	sessionData: SessionData,
	newItems: {
		id: string;
		count: number;
	}[]
) {
	if (!sessionData.selected_offers) return [];
	const offerId = sessionData.selected_offers[0].id;
	if (offerId === "FLAT50") {
		return [];
	}
	if (offerId === "combo1") {
		return [
			{
				code: "quote_trail",
				list: [
					{
						code: "type",
						value: "item",
					},
					{
						code: "id",
						value: "combo1",
					},
					{
						code: "currency",
						value: "INR",
					},
					{
						code: "value",
						value: "75.00",
					},
				],
			},
			{
				"@ondc/org/item_id": "combo1",
				title: "Flat discount of ₹75 on combo",
				"@ondc/org/title_type": "offer",
				price: {
					currency: "INR",
					value: "0",
				},
				item: {
					tags: [
						{
							code: "quote",
							list: [
								{
									code: "type",
									value: "order",
								},
							],
						},
						{
							code: "offer",
							list: [
								{
									code: "type",
									value: "combo",
								},
								{
									code: "additive",
									value: "no",
								},
								{
									code: "auto",
									value: "no",
								},
							],
						},
					],
				},
			},
		];
	}
	let totalQuantity = 0;
	for (const item of newItems) {
		totalQuantity += item.count;
	}
	console.log(
		"Total quantity of I2 for buy2get3 offer: ",
		totalQuantity,
		newItems
	);
	if (offerId === "buy2get3" && totalQuantity < 2) {
		return [
			{
				code: "quote_trail",
				list: [
					{
						code: "type",
						value: "item",
					},
					{
						code: "id",
						value: "buy2get3",
					},
					{
						code: "currency",
						value: "INR",
					},
					{
						code: "value",
						value: "0",
					},
				],
			},
			{
				"@ondc/org/item_id": "buy2get3",
				"@ondc/org/item_quantity": {
					count: 0,
				},
				title: "buy 2 items, get 3rd for free or at offered price",
				"@ondc/org/title_type": "offer",
				price: {
					currency: "INR",
					value: "0.00",
				},
				item: {
					tags: [
						{
							code: "quote",
							list: [
								{
									code: "type",
									value: "order",
								},
							],
						},
						{
							code: "offer",
							list: [
								{
									code: "type",
									value: "buyXgetY",
								},
								{
									code: "auto",
									value: "yes",
								},
								{
									code: "additive",
									value: "no",
								},
								{
									code: "item_id",
									value: "I2",
								},
								{
									code: "item_count",
									value: "1",
								},
								{
									code: "item_value",
									value: "0.00",
								},
							],
						},
					],
				},
			},
		];
	}
	return [];
}
