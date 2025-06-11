import { SessionData, Input } from "../../../../session-types";
import {
	generateQuoteTrail,
	buildRetailQuote,
} from "../../../../../../../utils/generic-utils";
import { on_search_items } from "../../data";

export const onUpdatePartCancelGenerator = (
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
		canceledParentItemId = sessionData.items.find(
			(item) => item.id === inputs?.partCancelItemId
		)?.parent_item_id;

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
						sessionData.quote.breakup,
						existingPayload.message.order.items,
						{ partCancel: true },
						canceledParentItemId
					),
				],
			},
		];
	}

	if (sessionData.quote) {
		existingPayload.message.order.quote = buildRetailQuote(
			existingPayload.message.order.items,
			on_search_items,
			existingPayload.message.order.fulfillments
		);
	}
	existingPayload.message.order.updated_at = existingPayload.context.timestamp;
	return existingPayload;
};
