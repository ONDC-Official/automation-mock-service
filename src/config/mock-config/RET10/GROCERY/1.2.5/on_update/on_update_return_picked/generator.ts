import { SessionData } from "../../../../session-types";
import { createQuote } from "../../api-objects/breakup";
import { Fulfillment, Fulfillments } from "../../api-objects/fulfillments";
import jsonpath from "jsonpath";
export async function on_update_picked_generator(
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

	const deliveryFulfillment = existingPayload.message.order.fulfillments.find(
		(f: Fulfillment) => f.type == "Delivery"
	) as Fulfillment;

	const itemCodes = jsonpath.query(
		sessionData.fulfillments,
		`$..tags[?(@.code=="return_request")].list[?(@.code=="item_id")].value`
	);

	const items: any[] = [];
	const fulfillments = sessionData.fulfillments as Fulfillments;
	const fulfillmentId = fulfillments.find(
		(f: Fulfillment) => f.type == "Return"
	)?.id;
	console.log("fulfillmentId", fulfillmentId);
	sessionData.items.forEach((item: any) => {
		if (itemCodes.includes(item.id)) {
			items.push({
				...item,
				quantity: {
					count: 1,
				},
				fulfillment_id: fulfillmentId,
			});
			item.quantity.count -= 1;
		}
		items.push(item);
	});
	existingPayload.message.order.items = items;

	existingPayload.message.order.fulfillments = sessionData.fulfillments.map(
		(f: Fulfillment) => {
			if (f.type == "Return") {
				const tags = f?.tags as any[];

				return {
					...f,
					state: {
						descriptor: {
							code: "Return_Picked",
						},
					},
					start: {
						location: deliveryFulfillment.end?.location,
						time: {
							...f.start?.time,
							timeStamp: new Date().toISOString(),
						},
					},
					tags: [
						...tags,
						{
							code: "quote_trail",
							list: [
								{
									code: "type",
									value: "item",
								},
								{
									code: "id",
									value: itemCodes[0],
								},
								{
									code: "currency",
									value: "INR",
								},
								{
									code: "value",
									value:
										"-" +
										sessionData.quote?.breakup?.find(
											(b: any) => b["@ondc/org/item_id"] == itemCodes[0]
										)?.item.price?.value,
								},
							],
						},
					],
				};
			}
			return f;
		}
	);

	existingPayload.message.order.quote = createQuote(
		items
			.filter((i) => i.fulfillment_id != fulfillmentId)
			.map((item: any) => {
				return {
					id: item.id,
					count: item.quantity.count,
				};
			}),
		sessionData,
		existingPayload
	);

	return existingPayload;
}
