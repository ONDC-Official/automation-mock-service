import { SessionData } from "../../../../session-types";
import { Fulfillment } from "../../api-objects/fulfillments";

export async function on_update_return_delivered_generator(
	existingPayload: any,
	sessionData: SessionData
) {
	existingPayload.message.order.id = sessionData.order_id;
	existingPayload.message.order.provider = sessionData.provider;
	existingPayload.message.order.items = sessionData.items;
	existingPayload.message.order.billing = sessionData.billing;
	existingPayload.message.order.payment = sessionData.payment;
	existingPayload.message.order.created_at = sessionData.order_created_at;
	existingPayload.message.order.updated_at = new Date().toISOString();
	existingPayload.message.order.quote = sessionData.quote;
	existingPayload.message.order.fulfillments = sessionData.fulfillments.map(
		(f: Fulfillment) => {
			if (f.type == "Return") {
				return {
					...f,
					state: {
						descriptor: {
							code: "Order-delivered",
						},
					},
					end: {
						...f.end,
						time: {
							...f.end?.time,
							timeStamp: new Date().toISOString(),
						},
					},
				};
			}
			return f;
		}
	);
	return existingPayload;
}
