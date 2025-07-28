import { SessionData } from "../../../session-types";
import { RET10GROCERY125Catalog } from "../on_search/catalog";
import { Fulfillments } from "./fulfillments";

export const breakupItem = {
	"@ondc/org/item_id": "I1",
	"@ondc/org/item_quantity": {
		count: 1,
	},
	title: "Plain Atta",
	"@ondc/org/title_type": "item",
	price: {
		currency: "INR",
		value: "100.00",
	},
	item: {
		quantity: {
			available: {
				count: "99",
			},
			maximum: {
				count: "99",
			},
		},
		price: {
			currency: "INR",
			value: "100.00",
		},
	},
};

export const breakup = [
	{
		"@ondc/org/item_id": "F1",
		title: "Delivery charges",
		"@ondc/org/title_type": "delivery",
		price: {
			currency: "INR",
			value: "00.00",
		},
	},
	{
		"@ondc/org/item_id": "F1",
		title: "Convenience Fee",
		"@ondc/org/title_type": "misc",
		price: {
			currency: "INR",
			value: "00.00",
		},
	},
];
export function createQuote(
	selectedItems: { id: string; count: number; fulfillment_id: string }[],
	sessionData: SessionData,
	existingPayload: any,
	fulfillments: Fulfillments,
	cancelled: boolean = false
) {
	console.log("\n ## Creating Quote with selected items: \n", selectedItems);

	let totalPrice = 0;
	let totalQuantity = 0;
	let itemSet = new Set<string>();
	const breakupObject = [];
	const catalogItems = RET10GROCERY125Catalog.catalog[
		"bpp/providers"
	][0].items.filter((i) => {
		console.log("Catalog Item: ", i.id);
		const idMap = selectedItems.map((item) => item.id);
		console.log("ID Map: ", idMap);
		return idMap.includes(i.id);
	});
	for (const selectedItem of selectedItems ?? []) {
		const fulfillment = fulfillments.find(
			(f) => f.id === selectedItem.fulfillment_id
		);
		if (
			!fulfillment ||
			!["Delivery", "Self-Pickup", "Buyer-Delivery"].includes(
				fulfillment.type ?? ""
			)
		) {
			continue;
		}
		const catalogItem = catalogItems.find((i) => i.id === selectedItem.id);
		if (!catalogItem) continue; // Skip if item not found in catalog

		const quantity = cancelled ? 0 : selectedItem.count ?? 1;
		const price = parseFloat(catalogItem.price.value) * quantity;
		console.log("Price: ", price, catalogItem.price.value);
		totalPrice += price;

		const breakupClone = JSON.parse(
			JSON.stringify(breakupItem)
		) as typeof breakupItem;
		breakupClone["@ondc/org/item_id"] = catalogItem.id;
		breakupClone.title = catalogItem.descriptor.name;
		breakupClone["@ondc/org/item_quantity"].count = quantity;
		breakupClone.price.value = `${price.toFixed(2)}`;
		breakupClone.item.price.value = catalogItem.price.value;
		breakupObject.push(breakupClone);

		if (sessionData.out_of_stock_item_ids?.includes(catalogItem.id)) {
			breakupClone.item.quantity.available.count = "0";
			breakupClone.item.quantity.maximum.count = "0";
			breakupClone["@ondc/org/title_type"] = "0";
			existingPayload.error = {
				type: "DOMAIN-ERROR",
				code: "40002",
				message: `Item with id: ${catalogItem.id} is out of stock`,
			};
		} else {
			totalQuantity += selectedItem.count ?? 0;
			if (quantity > 0) itemSet.add(catalogItem.id);
		}
	}

	breakupObject.push(breakup[0]);
	breakupObject.push(breakup[1]);
	if (sessionData.selected_offers && sessionData.selected_offers.length > 0) {
		let offerQuote =
			offerQuotes[
				sessionData.selected_offers[0].id as keyof typeof offerQuotes
			];

		const offerId = sessionData.selected_offers[0].id;

		if (offerId === "FLAT50" && totalQuantity > 0) {
			breakupObject.push(offerQuote);
			let offerPrice = parseFloat(offerQuote.price.value);
			if (cancelled) offerPrice = 0;
			totalPrice += offerPrice;
		} else if (offerId === "combo1" && itemSet.size >= 3) {
			breakupObject.push(offerQuote);
			let offerPrice = parseFloat(offerQuote.price.value);
			if (cancelled) offerPrice = 0;
			totalPrice += offerPrice;
		} else if (
			offerId === "buy2get3" &&
			totalQuantity >= 2 &&
			!sessionData.out_of_stock_item_ids?.includes("I2")
		) {
			if (cancelled) {
				//@ts-ignore
				offerQuote["@ondc/org/item_quantity"] = {
					count: 0,
				};
			}
			breakupObject.push(offerQuote);
		}
	}
	return {
		breakup: breakupObject,
		price: {
			currency: "INR",
			value: `${totalPrice.toFixed(2)}`,
		},
		ttl: "P1D",
	};
}

const offerQuotes = {
	FLAT50: {
		"@ondc/org/item_id": "FLAT50",
		title: "Flat discount of ₹50 on minimum cart value of ₹200",
		"@ondc/org/title_type": "offer",
		price: {
			currency: "INR",
			value: "-50.00",
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
							code: "id",
							value: "FLAT50",
						},
						{
							code: "type",
							value: "discount",
						},
						{
							code: "auto",
							value: "no",
						},
						{
							code: "additive",
							value: "no",
						},
						{
							code: "item_id",
							value: "",
						},
						{
							code: "item_value",
							value: "",
						},
						{
							code: "item_count",
							value: "",
						},
					],
				},
			],
		},
	},
	combo1: {
		"@ondc/org/item_id": "combo1",
		title: "Flat discount of ₹75 on combo",
		"@ondc/org/title_type": "offer",
		price: {
			currency: "INR",
			value: "-75.00", // 0 if failed
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
	buy2get3: {
		"@ondc/org/item_id": "buy2get3",
		"@ondc/org/item_quantity": {
			count: 1, // if i2 is available and total quantity is more than 2
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
};
