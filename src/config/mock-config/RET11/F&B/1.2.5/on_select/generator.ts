import { SessionData } from "../../../session-types";
import { buildRetailQuote } from "../../../../../../utils/generic-utils";
import { on_search_items, on_search_offers } from "../data";

export const onSelectGenerator = (
	existingPayload: any,
	sessionData: SessionData
) => {
	if (sessionData?.provider) {
		existingPayload.message.order.provider = sessionData.provider;
	}

	const tempItems = JSON.parse(JSON.stringify(sessionData.items));

	if (sessionData?.items && sessionData?.select_fulfillment?.length) {
		existingPayload.message.order.items = tempItems.map((item: any) => {
			delete item.quantity;
			return {
				...item,
				fulfillment_id: existingPayload.message.order.fulfillments?.find(
					(fulfillment: any) => fulfillment.type === "Delivery"
				)?.id,
			};
		});
	}

	existingPayload.message.order.quote = buildRetailQuote(
		sessionData.items,
		on_search_items,
		existingPayload.message.order.fulfillments,
		{
			offers: sessionData?.offers,
			initalOffers: on_search_offers,
		}
	);

	return existingPayload;
};
