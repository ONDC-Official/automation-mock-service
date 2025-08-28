import { SessionData } from "../../../session-types";

export async function search_seller_pagination_generator(
	existingPayload: any,
	sessionData: SessionData
) {
	delete existingPayload.context.bpp_uri;
	delete existingPayload.context.bpp_id;

	const now = new Date();
	const end = new Date(now);
	end.setDate(now.getDate() + 2);

	if (sessionData.user_inputs) {
		const buyerInputs = sessionData.user_inputs;
		const items = existingPayload.message?.intent?.provider?.items || [];

		if (items.length > 0) {
			const tags = items[0].tags?.find(
				(t: any) => t.descriptor?.code === "BAP_INPUTS"
			);

			if (tags?.list) {
				tags.list.forEach((entry: any) => {
					switch (entry.descriptor?.code) {
						case "BUYER_NAME":
							if (buyerInputs.buyer_name)
								entry.value = buyerInputs.buyer_name;
							break;
						case "BUYER_PHONE_NUMBER":
							if (buyerInputs.phone_number)
								entry.value = buyerInputs.phone_number;
							break;
						case "BUYER_PAN_NUMBER":
							if (buyerInputs.pan_number)
								entry.value = buyerInputs.pan_number;
							break;
						case "START_ADDRESS":
							if (buyerInputs.start_address)
								entry.value = buyerInputs.start_address;
							break;
						case "END_ADDRESS":
							if (buyerInputs.end_address)
								entry.value = buyerInputs.end_address;
							break;
					}
				});
			}
		}
	}

	if (
		existingPayload.message?.intent?.fulfillment?.stops?.[0]?.time?.range
	) {
		existingPayload.message.intent.fulfillment.stops[0].time.range.start =
			now.toISOString();
		existingPayload.message.intent.fulfillment.stops[0].time.range.end =
			end.toISOString();
	}

	if (sessionData.user_inputs?.city_code) {
		existingPayload.context.location.city.code =
			sessionData.user_inputs.city_code;
	}

	return existingPayload;
}
