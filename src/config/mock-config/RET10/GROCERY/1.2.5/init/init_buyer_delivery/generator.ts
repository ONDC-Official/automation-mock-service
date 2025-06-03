import { SessionData } from "../../../../session-types";
import { getUpdatedBilling } from "../../api-objects/billing";
import { createFulfillments } from "../../api-objects/fulfillments";
import { Fulfillments } from "../../api-objects/fulfillments";
import { SelectedItems } from "../../on_select/on_select/generator";
export async function init_buyer_delivery_generator(
	existingPayload: any,
	sessionData: SessionData
) {
	const items = sessionData.selected_items as SelectedItems;
	const onSelectData = sessionData.on_select_fulfillments as Fulfillments;
	const fId = onSelectData.find((f) => f.type === "Buyer-Delivery")?.id || "F3";

	existingPayload.message.order.items = items.map((item) => {
		return {
			id: item.id,
			fulfillment_id: fId,
			quantity: {
				count: item.quantity.count,
			},
			location_id: item.location_id,
		};
	});
	existingPayload.message.order.billing = getUpdatedBilling(
		existingPayload.message.order.billing,
		true
	);
	existingPayload.message.order.fulfillments = createFulfillments(
		"init",
		"init_buyer_delivery",
		sessionData,
		existingPayload.message.order.fulfillments
	);
	existingPayload.message.order.provider = sessionData.provider;

	return existingPayload;
}
