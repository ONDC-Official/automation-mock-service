import { SessionData } from "../../../session-types";
import { RET10GROCERY125Catalog } from "../on_search/catalog";

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
	selectedItems: { id: string; count: number }[],
	sessionData: SessionData,
	existingPayload: any
) {
	let totalPrice = 0;
	const breakupObject = [];
	const catalogItems = RET10GROCERY125Catalog.catalog[
		"bpp/providers"
	][0].items.filter((i) => {
		console.log("Catalog Item: ", i.id);
		const idMap = selectedItems.map((item) => item.id);
		console.log("ID Map: ", idMap);
		return idMap.includes(i.id);
	});
	for (const i of catalogItems) {
		const quantity =
			selectedItems?.find((item) => item.id === i.id)?.count ?? 1;
		const price = parseFloat(i.price.value) * quantity;
		console.log("Price: ", price, i.price.value);
		totalPrice += price;
		const breakupClone = JSON.parse(
			JSON.stringify(breakupItem)
		) as typeof breakupItem;
		breakupClone["@ondc/org/item_id"] = i.id;
		breakupClone.title = i.descriptor.name;
		breakupClone["@ondc/org/item_quantity"].count = quantity;
		breakupClone.price.value = `${price.toFixed(2)}`;
		breakupClone.item.price.value = i.price.value;
		breakupObject.push(breakupClone);
		if (sessionData.out_of_stock_item_ids?.includes(i.id)) {
			breakupClone.item.quantity.available.count = "0";
			breakupClone.item.quantity.maximum.count = "0";
			breakupClone["@ondc/org/title_type"] = "0";
			existingPayload.error = {
				type: "DOMAIN-ERROR",
				code: "40002",
				message: `Item with id: ${i.id} is out of stock`,
			};
		}
	}
	breakupObject.push(breakup[0]);
	breakupObject.push(breakup[1]);
	return {
		breakup: breakupObject,
		price: {
			currency: "INR",
			value: `${totalPrice.toFixed(2)}`,
		},
		ttl: "P1D",
	};
}
