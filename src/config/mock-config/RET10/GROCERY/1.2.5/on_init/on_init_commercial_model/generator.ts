import { SessionData } from "../../../../session-types";
import { getUpdatedBilling } from "../../api-objects/billing";
import { createFulfillments } from "../../api-objects/fulfillments";

export async function on_init_commercial_model_generator(
	existingPayload: any,
	sessionData: SessionData
) {
	const npFeesInput: string[] = sessionData.selected_np_fees || [];

	existingPayload.message.order.items = sessionData.items;
	existingPayload.message.order.fulfillments = createFulfillments(
		"on_init",
		"on_init",
		sessionData,
		existingPayload.message.order.fulfillments
	);
	existingPayload.message.order.billing = getUpdatedBilling(sessionData.billing);
	existingPayload.message.order.provider = sessionData.provider;
	existingPayload.message.order.quote = sessionData.quote;

	// Filter breakup dynamically based on npFeesInput
	const filteredBreakup: any[] = [];
	const items = sessionData.items || [];

	items.forEach((item: any, index: number) => {
		const itemId = item.id;
		const allowedNpFeeId = npFeesInput[index];

		const relatedBreakups = existingPayload.message.order.quote.breakup.filter(
			(b: any) => b["@ondc/org/item_id"] === itemId
		);

		relatedBreakups.forEach((b: any) => {
			if (b["@ondc/org/title_type"] === "item") {
				if (b.item && b.item.quantity) delete b.item.quantity;
				filteredBreakup.push(b);
			} else {
				const npFeeTag = b.item?.tags?.find((t: any) => t.code === "np_fees");
				const feeId = npFeeTag?.list?.find((l: any) => l.code === "id")?.value;
				if (!feeId || feeId === allowedNpFeeId) {
					filteredBreakup.push(b);
				}
			}
		});
	});

	const fulfillmentBreakups =
		existingPayload.message.order.quote.breakup.filter(
			(b: any) => !items.some((it: any) => it.id === b["@ondc/org/item_id"])
		);

	existingPayload.message.order.quote.breakup = [
		...filteredBreakup,
		...fulfillmentBreakups,
	];

	let total = 0;
	existingPayload.message.order.quote.breakup.forEach((b: any) => {
		const val = parseFloat(b.price?.value || "0");
		if (!isNaN(val)) total += val;
	});

	existingPayload.message.order.quote.price = {
		...existingPayload.message.order.quote.price,
		value: total.toFixed(2),
	};
	return existingPayload;

}
