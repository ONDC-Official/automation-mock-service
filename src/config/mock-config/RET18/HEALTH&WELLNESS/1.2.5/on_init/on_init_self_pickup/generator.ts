import { SessionData } from "../../../../session-types";
import { getUpdatedBilling } from "../../api-objects/billing";
import { createFulfillments } from "../../api-objects/fulfillments";

export async function on_init_self_pickup_generator(
	existingPayload: any,
	sessionData: SessionData
) {
	existingPayload.message.order.items = sessionData.items;
	existingPayload.message.order.fulfillments = createFulfillments(
		"on_init",
		"on_init",
		sessionData,
		existingPayload.message.order.fulfillments
	);
	delete existingPayload.message.order.fulfillments[0].tracking;
	existingPayload.message.order.billing = getUpdatedBilling(
		sessionData.billing
	);
	existingPayload.message.order.provider = sessionData.provider;
	existingPayload.message.order.quote = sessionData.quote;
	const selectedIds = sessionData.on_select_fulfillments.map((f: any) => f.id);
	const existingIds = sessionData.fulfillments.map((f: any) => f.id);

	const missingIds = selectedIds.filter((id: any) => !existingIds.includes(id));
	existingPayload.message.order.quote.breakup =
		existingPayload.message.order.quote.breakup.filter(
			(item: any) => !missingIds.includes(item["@ondc/org/item_id"])
		);

	existingPayload.message.order.quote.breakup =
		existingPayload.message.order.quote.breakup.map((b: any) => {
			if (b["@ondc/org/title_type"] === "item") {
				if (b.item && b.item.quantity) delete b.item.quantity;
			}
			console.log("Quote Breakup: ", b);
			return b;
		});

	return existingPayload;
}
