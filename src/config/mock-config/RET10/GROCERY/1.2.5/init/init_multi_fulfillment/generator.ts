import { SessionData } from "../../../../session-types";
import { getUpdatedBilling } from "../../api-objects/billing";
import { Fulfillments } from "../../api-objects/fulfillments";
import { SelectedItems } from "../../on_select/on_select/generator";
import { getRandomItem } from "../../on_select/on_select_out_of_stock/generator";

export async function init_multi_fulfillment_generator(
	existingPayload: any,
	sessionData: SessionData
) {
	const fulfillments = sessionData.on_select_fulfillments as Fulfillments;
	const items = sessionData.on_select_items;
	const selectedItems = sessionData.selected_items as SelectedItems;

	const selectedFids: Set<string> = new Set();
	existingPayload.message.order.items = selectedItems.map((selectedItem) => {
		const item = items.find((item: any) => selectedItem.id === item.id);
		const fId = getRandomItem(
			item.fulfillment_ids || [item.fulfillment_id]
		) as string;
		selectedFids.add(fId);
		return {
			id: item.id,
			quantity: {
				count: selectedItem?.quantity.count,
			},
			location_id: selectedItem?.location_id,
			fulfillment_id: fId,
		};
	});

	const newFulfillments: Fulfillments = [];
	const selected = sessionData.selected_fulfillments as Fulfillments;
	for (const f of selectedFids) {
		const fulfillment = fulfillments.find(
			(fulfillment) => fulfillment.id === f
		);

		newFulfillments.push({
			id: f,
			type: fulfillment?.type || "Delivery",
			end: {
				contact: {
					email: "nobody@nomail.com",
					phone: "9898989898",
				},
				location: {
					gps: selected[0].end?.location?.gps,
					address: {
						building: "mock-building",
						city: "mock-city",
						state: "mock-state",
						country: "IND",
						area_code:
							selected[0].end?.location?.address?.area_code || "400053",
						locality: "mock-locality",
						name: "mock-house-name",
					},
				},
			},
		});
	}
	existingPayload.message.order.fulfillments = newFulfillments;
	existingPayload.message.order.billing = getUpdatedBilling(
		existingPayload.message.order.billing,
		true
	);
	existingPayload.message.order.provider = sessionData.provider;
	return existingPayload;
}
