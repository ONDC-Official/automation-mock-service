import { SessionData } from "../../../../session-types";
import { createQuote } from "../../api-objects/breakup";
import { SelectedItems } from "../on_select/generator";

export async function on_select_multi_fulfillment_generator(
	existingPayload: any,
	sessionData: SessionData
) {
	const selectedItemsObj = sessionData.selected_items as SelectedItems;

	const quote = createQuote(
		selectedItemsObj.map((item) => {
			return {
				id: item.id,
				count: item.quantity.count,
				fulfillment_id: "F1",
			};
		}),
		sessionData,
		existingPayload,
		existingPayload.message.order.fulfillments
	);
	quote.breakup.push(
		{
			"@ondc/org/item_id": "F2",
			title: "Delivery charges",
			"@ondc/org/title_type": "delivery",
			price: {
				currency: "INR",
				value: "00.00",
			},
		},
		{
			"@ondc/org/item_id": "F2",
			title: "Convenience Fee",
			"@ondc/org/title_type": "misc",
			price: {
				currency: "INR",
				value: "00.00",
			},
		},
		{
			"@ondc/org/item_id": "F3",
			title: "Delivery charges",
			"@ondc/org/title_type": "delivery",
			price: {
				currency: "INR",
				value: "00.00",
			},
		},
		{
			"@ondc/org/item_id": "F3",
			title: "Convenience Fee",
			"@ondc/org/title_type": "misc",
			price: {
				currency: "INR",
				value: "00.00",
			},
		}
	);
	existingPayload.message.order.quote = quote;

	return existingPayload;
}
