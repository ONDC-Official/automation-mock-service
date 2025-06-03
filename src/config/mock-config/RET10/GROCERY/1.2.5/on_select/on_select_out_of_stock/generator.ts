import { SessionData } from "../../../../session-types";
import { RET10GROCERY125Catalog } from "../../on_search/catalog";
import { breakup, breakupItem, SelectedItems } from "../on_select/generator";

export async function on_select_out_of_stock_generator(
	existingPayload: any,
	sessionData: SessionData
) {
	const selectedItemsObj = sessionData.selected_items as SelectedItems;
	console.log("Selected Items: ", selectedItemsObj);
	const catalog = RET10GROCERY125Catalog;
	existingPayload.message.order.items = selectedItemsObj.map((item) => {
		return {
			id: item.id,
			fulfillment_id: "F1",
		};
	});
	const catalogItems = catalog.catalog["bpp/providers"][0].items.filter((i) => {
		console.log("Catalog Item: ", i.id);
		const idMap = selectedItemsObj.map((item) => item.id);
		console.log("ID Map: ", idMap);
		return idMap.includes(i.id);
	});
	console.log("Catalog Items: ", catalogItems);
	let totalPrice = 0;
	const breakupObject = [];
	const randomOutOfStockItem = getRandomItem(
		catalogItems.map((item) => item.id)
	);
	for (const i of catalogItems) {
		const quantity =
			selectedItemsObj?.find((item) => item.id === i.id)?.quantity.count ?? 1;
		const price = parseFloat(i.price.value) * quantity;
		console.log("Price: ", price, i.price.value);
		totalPrice += price;
		const item = breakupItem;
		breakupItem["@ondc/org/item_id"] = i.id;
		breakupItem.title = i.descriptor.name;
		breakupItem["@ondc/org/item_quantity"].count = quantity;
		breakupItem.price.value = `${price.toFixed(2)}`;
		breakupItem.item.price.value = i.price.value;
		breakupObject.push(item);
		if (
			sessionData.out_of_stock_item_ids?.includes(i.id) ||
			i.id === randomOutOfStockItem
		) {
			breakupItem.item.quantity.available.count = "0";
			breakupItem.item.quantity.maximum.count = "0";
			breakupItem["@ondc/org/title_type"] = "0";
			existingPayload.error = {
				type: "DOMAIN-ERROR",
				code: "40002",
				message: `Item with id: ${i.id} is out of stock`,
			};
		}
	}
	breakupObject.push(breakup[0]);
	breakupObject.push(breakup[1]);
	existingPayload.message.order.quote.breakup = breakupObject;
	existingPayload.message.order.quote.price.value = `${totalPrice.toFixed(2)}`;
	return existingPayload;
}

export function getRandomItem(items: string[]): string | undefined {
	if (items.length === 0) {
		return undefined;
	}
	const randomIndex = Math.floor(Math.random() * items.length);
	return items[randomIndex];
}
