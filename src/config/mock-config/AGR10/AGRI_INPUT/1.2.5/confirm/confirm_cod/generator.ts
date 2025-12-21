import { SessionData } from "../../../../session-types";
import { getUpdatedBilling } from "../../api-objects/billing";
import { createFulfillments } from "../../api-objects/fulfillments";
import { TagsType } from "../../api-objects/tags";

export async function confirm_cod_generator(
	existingPayload: any,
	sessionData: SessionData
) {
	const timeIso = new Date().toISOString();
	existingPayload.message.order.id = generateSixDigitCode();
	existingPayload.message.order.created_at = timeIso;
	existingPayload.message.order.updated_at = timeIso;
	existingPayload.message.order.quote = sessionData.quote;
	existingPayload.message.order.billing = getUpdatedBilling(
		sessionData.billing
	);
	existingPayload.message.order.items = sessionData.items;
	existingPayload.message.order.provider = sessionData.provider;
	existingPayload.message.order.payment.params.amount =
		sessionData.quote?.price?.value;
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
