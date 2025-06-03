import { SessionData } from "../../../../session-types";
import { Fulfillments } from "../../api-objects/fulfillments";
import jsonpath from "jsonpath";
export async function update_delivered_generator(
	existingPayload: any,
	sessionData: SessionData
) {
	existingPayload.message.order.id = sessionData.order_id;
	const fulfillments = sessionData.fulfillments as Fulfillments;
	const targetFulfillment = fulfillments.find(
		(f) => f.type === "Buyer-Delivery"
	);

	// const start = jsonpath.query(
	// 	sessionData.update_fulfillments,
	// 	`$..tags[?(@.code=="update_fulfillment_time")].list[?(@.code=="start_time")].value`
	// );
	existingPayload.message.order.fulfillments = [
		{
			id: targetFulfillment?.id,
			tags: [
				{
					code: "update_state",
					list: [
						{
							code: "state",
							value: "Order-delivered",
						},
					],
				},
				{
					code: "update_fulfillment_time",
					list: [
						{
							code: "state",
							value: "Order-delivered",
						},
						{
							code: "timestamp",
							value: new Date().toISOString(),
						},
						// {
						// 	code: "start_time",
						// 	value: start[0] || new Date().toISOString(),
						// },
						// {
						// 	code: "end_time",
						// 	value: new Date().toISOString(),
						// },
					],
				},
			],
		},
	];
	return existingPayload;
}
