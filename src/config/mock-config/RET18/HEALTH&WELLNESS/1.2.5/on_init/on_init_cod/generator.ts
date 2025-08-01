import { SessionData } from "../../../../session-types";
import { getUpdatedBilling } from "../../api-objects/billing";
import { createFulfillments } from "../../api-objects/fulfillments";
import { removeItemQuantitiesFromQuote } from "../../api-objects/quotes";

export async function on_init_cod_generator(
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
	existingPayload.message.order.quote = removeItemQuantitiesFromQuote(sessionData.quote)
	return existingPayload;
}
