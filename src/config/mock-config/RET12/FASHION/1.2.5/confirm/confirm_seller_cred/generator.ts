import { SessionData } from "../../../../session-types";
import { getUpdatedBilling } from "../../api-objects/billing";
import { createFulfillments } from "../../api-objects/fulfillments";
import { removeItemQuantitiesFromQuote } from "../../api-objects/quotes";
import { TagsType } from "../../api-objects/tags";

export async function confirm_seller_cred_generator(
	existingPayload: any,
	sessionData: SessionData
) {
	const timeIso = new Date().toISOString();
	
	existingPayload.message.order.id = generateSixDigitCode();
	existingPayload.message.order.created_at = existingPayload.context.timestamp;
	existingPayload.message.order.updated_at = existingPayload.context.timestamp;
existingPayload.message.order.quote = removeItemQuantitiesFromQuote(sessionData.quote);
	existingPayload.message.order.billing = getUpdatedBilling(
		sessionData.billing
	);
	existingPayload.message.order.items = sessionData.items;
	existingPayload.message.order.provider = sessionData.provider;
	existingPayload.message.order.payment.params.amount =
		sessionData.quote?.price?.value;
	existingPayload.message.order.payment.params.transaction_id =
		"mock_payment_id_123";
	existingPayload.message.order.fulfillments = createFulfillments(
		"confirm",
		"confirm",
		sessionData,
		existingPayload.message.order.fulfillments
	);
	const existingTags = existingPayload.message.order.tags as TagsType;
	const bppTerms = existingTags.find((f) => f.code === "bpp_terms");
	if (bppTerms) {
		bppTerms.list = sessionData.bpp_terms.list;
	}
	return existingPayload;
}

export function generateSixDigitCode(): string {
	return Math.floor(100000 + Math.random() * 900000).toString();
}
