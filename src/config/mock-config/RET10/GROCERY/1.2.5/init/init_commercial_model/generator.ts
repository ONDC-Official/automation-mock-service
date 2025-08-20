import { SessionData } from "../../../../session-types";
import { getUpdatedBilling } from "../../api-objects/billing";
import {
	createFulfillments,
	Fulfillments,
} from "../../api-objects/fulfillments";
import { SelectedItems } from "../../on_select/on_select/generator";

export type SelectedNpFees = {
	item_id: string;
	id: string;
}[];

export async function init_commercial_model_generator(
	existingPayload: any,
	sessionData: SessionData
) {
	const items = sessionData.selected_items as SelectedItems;
	const npFeesRaw = sessionData?.user_inputs?.np_fees || [];

	const npFeesInput: SelectedNpFees = npFeesRaw?.map((code: string) => {
		const [item_id, npfId] = code.split("_npf_");
		return { item_id, id: `${npfId}` };
	});

	sessionData.selected_np_fees= npFeesInput as SelectedNpFees
	const onSelectData = sessionData.on_select_fulfillments as Fulfillments;
	const fId = onSelectData.find((f) => f.type === "Delivery")?.id || "F1";

	existingPayload.message.order.items = items.map((item) => {
		const npFee =
			npFeesInput?.find((fee) => fee.item_id === item.id) ?? {
				item_id: item.id,
				id: "1", // default np_fee id
			};
		return {
			id: item.id,
			fulfillment_id: fId,
			quantity: {
				count: item.quantity.count,
			},
			location_id: item.location_id,
			tags: [
				{
					code: "np_fees",
					list: [
						{
							code: "id",
							value: npFee.id,
						},
					],
				},
			],
		};
	});
	existingPayload.message.order.billing = getUpdatedBilling(
		existingPayload.message.order.billing,
		true
	);
	existingPayload.message.order.fulfillments = createFulfillments(
		"init",
		"init",
		sessionData,
		existingPayload.message.order.fulfillments
	);
	existingPayload.message.order.provider = sessionData.provider;
	if (sessionData.selected_offers) {
		existingPayload.message.order.offers = sessionData.selected_offers.map(
			(offer: any) => {
				return {
					id: offer.id,
					tags: [
						{
							code: "selection",
							list: [
								{
									code: "apply",
									value: "yes",
								},
							],
						},
					],
				};
			}
		);
	}

	return existingPayload;
}
