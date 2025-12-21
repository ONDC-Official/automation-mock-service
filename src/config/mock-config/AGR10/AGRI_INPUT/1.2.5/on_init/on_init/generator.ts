import { SessionData } from "../../../../session-types";
import { getUpdatedBilling } from "../../api-objects/billing";
import { createFulfillments } from "../../api-objects/fulfillments";

export async function on_init_generator(
	existingPayload: any,
	sessionData: SessionData
) {
	console.log("###### on init_generator ####");
	existingPayload.message.order.items = sessionData.items;
	existingPayload.message.order.fulfillments = createFulfillments(
		"on_init",
		"on_init",
		sessionData,
		existingPayload.message.order.fulfillments
	);
	existingPayload.message.order.billing = getUpdatedBilling(
		sessionData.billing
	);
	existingPayload.message.order.provider = sessionData.provider;
	existingPayload.message.order.quote = sessionData.quote;

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
