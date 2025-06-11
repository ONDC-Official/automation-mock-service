import { SessionData } from "../../../../session-types";
import { getUpdatedBilling } from "../../api-objects/billing";
import {
	createFulfillments,
	Fulfillments,
} from "../../api-objects/fulfillments";
import { SelectedItems } from "../../on_select/on_select/generator";

export async function init_generator(
	existingPayload: any,
	sessionData: SessionData
) {
	console.log("SESSION DATA")
	console.log(sessionData)
	const items = sessionData.selected_items as SelectedItems;
	const onSelectData = sessionData.on_select_fulfillments as Fulfillments;
	console.log("ONSELECTDATA")
	console.log(onSelectData)
	const fId = onSelectData.find((f) => f.type === "Delivery")?.id || "F1";

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
		"init",
		sessionData,
		existingPayload.message.order.fulfillments
	);
	existingPayload.message.order.provider = sessionData.provider;
	return existingPayload;
}