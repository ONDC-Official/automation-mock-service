import { SessionData } from "../../../../session-types";
import { SelectedItems } from "../on_select/generator";
import { createQuote } from "../../api-objects/breakup";
export async function on_select_buyer_delivery_generator(
	existingPayload: any,
	sessionData: SessionData
) {
	const selectedItemsObj = sessionData.selected_items as SelectedItems;
	existingPayload.message.order.items = selectedItemsObj.map((item) => {
		return {
			id: item.id,
			fulfillment_id: "F32822",
		};
	});
	const quote = createQuote(
		selectedItemsObj.map((item) => {
			return {
				id: item.id,
				count: item.quantity.count,
			};
		}),
		sessionData,
		existingPayload
	);
	existingPayload.message.order.quote = quote;
	return existingPayload;
}
