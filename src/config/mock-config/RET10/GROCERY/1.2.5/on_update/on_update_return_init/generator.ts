import { SessionData } from "../../../../session-types";

export async function on_update_interim_reverse_qc_generator(
	existingPayload: any,
	sessionData: SessionData
) {
	existingPayload.message.order.id = sessionData.order_id;
	existingPayload.message.order.provider = sessionData.provider;
	existingPayload.message.order.items = sessionData.items;
	existingPayload.message.order.quote = sessionData.quote;
	existingPayload.message.order.billing = sessionData.billing;

	const allFulfillments = [
		...(sessionData.fulfillments || []),
		...(sessionData.update_fulfillments || []),
	];

	const updatedFulfillments = allFulfillments.map((f: any) => {
		if (f.type === "Return") {
			const tagId = f.tags
				?.find((t: any) => t.code === "return_request")
				?.list?.find((l: any) => l.code === "id")?.value;

			console.log("🔍 Found Return fulfillment:", {
				existingId: f.id,
				tagId,
			});

			return { ...f, id: tagId || f.id };
		}
		return f;
	});

	existingPayload.message.order.fulfillments = updatedFulfillments;

	existingPayload.message.order.payment = sessionData.payment;
	existingPayload.message.order.created_at = sessionData.order_created_at;
	existingPayload.message.order.updated_at = new Date().toISOString();
	return existingPayload;
}
