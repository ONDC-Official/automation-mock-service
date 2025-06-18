import { endianness } from "os";
import { SessionData } from "../../../../session-types";
import { Fulfillment } from "../../api-objects/fulfillments";
import { uniqueId } from "lodash";
import { randomUUID } from "crypto";

export async function on_update_approved_generator(
	existingPayload: any,
	sessionData: SessionData
) {

	existingPayload.message.order.id = sessionData.order_id;
	existingPayload.message.order.provider = sessionData.provider;
	existingPayload.message.order.items = sessionData.items;
	existingPayload.message.order.billing = sessionData.billing;
	existingPayload.message.order.quote = sessionData.quote;
	existingPayload.message.order.payment = sessionData.payment;
	existingPayload.message.order.created_at = sessionData.order_created_at;
	existingPayload.message.order.updated_at = new Date().toISOString();
	const deliveryFulfillment = existingPayload.message.order.fulfillments.find(
		(f: Fulfillment) => f.type == "Delivery"
	) as Fulfillment;

	existingPayload.message.order.fulfillments = sessionData.fulfillments.map(
		(f: Fulfillment) => {
			if (f.type == "Return") {
				return {
					...f,
					state: {
						descriptor: {
							code: "Return_Approved",
						},
					},
					"@ondc/org/provider_name": "mock_lsp_provider",
					start: {
						location: deliveryFulfillment.end?.location,
						time: {
							range: {
								start: new Date().toISOString(),
								end: new Date(
									new Date().getTime() + 1000 * 60 * 60 * 24
								).toISOString(),
							},
						},
					},
					end: {
						location: deliveryFulfillment.start?.location,
						time: {
							range: {
								start: new Date(
									new Date().getTime() + 1000 * 60 * 60 * 24
								).toISOString(),
								end: new Date(
									new Date().getTime() + 1000 * 60 * 60 * 48
								).toISOString(),
							},
						},
					},
				};
			}
			return f;
		}
	);
	return existingPayload;
}
