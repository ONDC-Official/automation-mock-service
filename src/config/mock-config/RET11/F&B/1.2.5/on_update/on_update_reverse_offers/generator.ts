import { SessionData, Input } from "../../../../session-types";
import {
	generateQuoteTrail,
	buildRetailQuote,
} from "../../../../../../../utils/generic-utils";
import { on_search_items, on_search_offers } from "../../data";

function getRandomItem(items: string[]): string | undefined {
	if (items.length === 0) {
		return undefined;
	}
	const randomIndex = Math.floor(Math.random() * items.length);
	return items[randomIndex];
}

export const onUpdateReverseOffersGenerator = (
	existingPayload: any,
	sessionData: SessionData,
	inputs?: Input
) => {
	if (sessionData.order_id) {
		existingPayload.message.order.id = sessionData.order_id;
	}

	if (sessionData.order_state) {
		existingPayload.message.order.state = sessionData.order_state;
	}

	if (sessionData.provider) {
		existingPayload.message.order.provider = sessionData.provider;
	}

	let canceledParentItemId = "";

	if (sessionData.items) {
		const itemIds = sessionData.items.map((item: any) => item.id) as string[];
		const randomCancelId = getRandomItem(itemIds) || "I1";

		const cancelItem = sessionData.items.find(
			(item: any) => item.id === randomCancelId
		);

		canceledParentItemId = cancelItem?.parent_item_id || "";

		const updatedItems: any[] = [];

		sessionData.items.forEach((item: any) => {
			if (item.parent_item_id === canceledParentItemId) {
				updatedItems.push({
					...item,
					quantity: {
						count: 0,
					},
				});
				updatedItems.push({
					...item,
					fulfillment_id: "C1",
				});
			} else {
				updatedItems.push(item);
			}
		});

		existingPayload.message.order.items = updatedItems;
	}

	if (sessionData.billing) {
		existingPayload.message.order.billing = sessionData.billing;
	}

	if (sessionData.payment) {
		existingPayload.message.order.payment = sessionData.payment;
	}

	if (sessionData.fulfillments) {
		existingPayload.message.order.fulfillments = [
			...sessionData.fulfillments,
			{
				id: "C1",
				type: "Cancel",
				state: {
					descriptor: {
						code: "Cancelled",
					},
				},
				tags: [
					{
						code: "cancel_request",
						list: [
							{
								code: "reason_id",
								value: "002",
							},
							{
								code: "initiated_by",
								value: existingPayload.context.bpp_id,
							},
						],
					},
					...generateQuoteTrail(
						sessionData.on_confirm_quote.breakup,
						existingPayload.message.order.items,
						{ partCancel: true },
						canceledParentItemId
					),
				],
			},
		];
	}

	if (sessionData.on_confirm_quote) {

		const quote = sessionData.on_confirm_quote;
		existingPayload.message.order.quote = buildRetailQuote(
			existingPayload.message.order.items,
			on_search_items,
			existingPayload.message.order.fulfillments,
			{
				offers: sessionData?.offers,
				initalOffers: on_search_offers,
			}
		);

	}
	existingPayload.message.order.updated_at = existingPayload.context.timestamp;
	return existingPayload;
};
