import { SessionData } from "../../../../session-types";
import { Fulfillments } from "../../api-objects/fulfillments";
import { isoDurToSec } from "../../api-objects/utils";

export async function update_picked_up_generator(
	existingPayload: any,
	sessionData: SessionData
) {
	existingPayload.message.order.id = sessionData.order_id;
	const fulfillments = sessionData.fulfillments as Fulfillments;
	const targetFulfillment = fulfillments.find(
		(f) => f.type === "Buyer-Delivery"
	);
	const tat = targetFulfillment?.["@ondc/org/TAT"] ?? "P2D";
	const seconds = isoDurToSec(tat);
	existingPayload.message.order.fulfillments = [
		{
			id: targetFulfillment?.id,
			tags: [
				{
					code: "update_state",
					list: [
						{
							code: "state",
							value: "Order-picked-up",
						},
					],
				},
				{
					code: "update_fulfillment_time",
					list: [
						{
							code: "state",
							value: "Order-picked-up",
						},
						{
							code: "timestamp",
							value: new Date().toISOString(),
						},
						// {
						// 	code: "start_time",
						// 	value: new Date().toISOString(),
						// },
						// {
						// 	code: "end_time",
						// 	value: new Date(
						// 		new Date().getTime() + seconds * 1000
						// 	).toISOString(),
						// },
					],
				},
				{
					code: "update_agent_details",
					list: [
						{
							code: "name",
							value: "agent_name",
						},
						{
							code: "phone",
							value: "9886098860",
						},
					],
				},
				{
					code: "bnp_diff_weight",
					list: [
						{
							code: "unit",
							value: "kilogram",
						},
						{
							code: "value",
							value: "1.5",
						},
					],
				},
				{
					code: "bnp_diff_length",
					list: [
						{
							code: "unit",
							value: "centimeter",
						},
						{
							code: "value",
							value: "1.5",
						},
					],
				},
				{
					code: "bnp_diff_breadth",
					list: [
						{
							code: "unit",
							value: "centimeter",
						},
						{
							code: "value",
							value: "1.5",
						},
					],
				},
				{
					code: "bnp_diff_height",
					list: [
						{
							code: "unit",
							value: "centimeter",
						},
						{
							code: "value",
							value: "1.5",
						},
					],
				},
			],
		},
	];
	return existingPayload;
}
