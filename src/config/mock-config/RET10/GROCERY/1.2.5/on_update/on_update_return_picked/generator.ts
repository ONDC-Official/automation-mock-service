import { SessionData } from "../../../../session-types";
import { Quote } from "../../api-objects/breakup-type";
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
		`$..tags[*][?(@.code=="return_request")].list[?(@.code=="item_id")].value`
	);
	console.log("itemCodes", itemCodes);
	const items: any[] = [];
	const fulfillments = sessionData.fulfillments as Fulfillments;
	const fulfillmentId = fulfillments.find(
		(f: Fulfillment) => f.type == "Return"
	)?.id;
	console.log("fulfillmentId", fulfillmentId);
	sessionData.items.forEach((item: any) => {
		if (itemCodes.includes(item.id)) {
			items.push({
				id: item.id,
				quantity: {
					count: item.quantity.count,
				},
				fulfillment_id: fulfillmentId,
			});
			item.quantity.count = 0;
		}
		items.push(item);
	});
	existingPayload.message.order.items = items;
	const quote = sessionData.quote as Quote;
	const breakup = quote.breakup ?? [];
	if (quote.price) {
		quote.price.value = "0.00";
	}
	const quoteTrails = breakup
		.map((item) => {
			const price = parseFloat(item.price?.value || "0");
			if (price === 0) return null;
			if (item.price) {
				item.price.value = "0.00";
			}
			if (item["@ondc/org/item_quantity"]) {
				item["@ondc/org/item_quantity"].count = 0;
			}
			return {
				code: "quote_trail",
				list: [
					{ code: "type", value: item["@ondc/org/title_type"] },
					{ code: "id", value: item["@ondc/org/item_id"] },
					{ code: "currency", value: "INR" },
					{ code: "value", value: `${-1 * price}` },
				],
			};
		})
		.filter((x): x is NonNullable<typeof x> => x !== null);
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
					tags: [...tags, ...quoteTrails],
				};
			}
			return f;
		}
	);
	existingPayload.message.order.quote = sessionData.quote;
	return existingPayload;
}
