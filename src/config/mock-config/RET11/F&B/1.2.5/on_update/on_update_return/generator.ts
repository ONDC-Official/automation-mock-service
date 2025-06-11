import { SessionData } from "../../../../session-types";
import {
	buildRetailQuote,
	generateQuoteTrail,
} from "../../../../../../../utils/generic-utils";
import { on_search_items } from "../../data";

export const onUpdateReturnGenerator = (
	existingPayload: any,
	sessionData: SessionData,
	action_id: string
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

	let returnParentItemId = "";

	if (sessionData.items) {
		const returnItemId =
			sessionData?.update_return_fulfillments?.[0].tags[0]?.list.find(
				(entry: any) => entry.code === "item_id"
			)?.value;

		returnParentItemId = sessionData.items.find(
			(item) => item.id === returnItemId
		).parent_item_id;

		const updatedItems: any[] = [];

		sessionData.items.forEach((item) => {
			if (item.parent_item_id === returnParentItemId) {
				updatedItems.push({
					...item,
					quantity: {
						count: 0,
					},
					fulfillment_id:
						sessionData.update_return_fulfillments?.[0].id || "R1",
				});
			}

			updatedItems.push(item);
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
		existingPayload.message.order.fulfillments = sessionData.fulfillments;

		if (
			sessionData.update_return_fulfillments &&
			action_id === "on_update_return_intermin"
		) {
			const quoteTrailTag: any[] = generateQuoteTrail(
				sessionData?.quote?.breakup,
				existingPayload.message.order.items,
				{
					fulfillmentState: "POST",
				}
			);

			existingPayload.message.order.fulfillments.push({
				id: sessionData.update_return_fulfillments[0].id,
				type: "Return",
				state: {
					descriptor: {
						code: "Return_Initiated",
					},
				},
				tags: [
					...sessionData.update_return_fulfillments[0].tags,
					...quoteTrailTag,
				],
			});
		}

		if (
			sessionData.update_return_fulfillments &&
			action_id === "on_update_return_final"
		) {
			existingPayload.message.order.fulfillments =
				existingPayload.message.order.fulfillments.map((fulfillment: any) => {
					if (fulfillment.type === "Return") {
						return {
							id: "R1",
							type: "Return",
							state: {
								descriptor: {
									code: "Liquidated",
								},
							},
							tags: [...sessionData?.update_return_fulfillments?.[0]?.tags],
						};
					}

					return fulfillment;
				});
		}
	}

	if (sessionData.quote) {
		existingPayload.message.order.quote = buildRetailQuote(
			existingPayload.message.order.items,
			on_search_items,
			existingPayload.message.order.fulfillments,
			{
				returnParentItemId: returnParentItemId,
			}
		);
	}
	existingPayload.message.order.updated_at = existingPayload.context.timestamp;
	return existingPayload;
};
