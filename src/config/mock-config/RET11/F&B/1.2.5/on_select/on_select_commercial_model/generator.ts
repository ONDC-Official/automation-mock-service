import { buildRetailQuote } from "../../../../../../../utils/generic-utils";
import { SessionData } from "../../../../session-types";
import { on_search_items, on_search_offers } from "../../data";
interface BapTerm {
	code: string;
	value: string;
}

export const onSelectCommercialModelGenerator = (
	existingPayload: any,
	sessionData: SessionData
) => {
	if (sessionData.search_bap_terms?.list && Array.isArray(sessionData.search_bap_terms.list)) {
		if (!sessionData.search_bap_terms.list.some((term: BapTerm) => term.code === "00A")) {
			sessionData.search_bap_terms.list.unshift({ code: "00A", value: "yes" });
		}
	} else {
		sessionData.search_bap_terms = {
			code: "bap_features",
			list: [{ code: "00A", value: "yes" }]
		};
	}

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
			search_bap_terms: sessionData.search_bap_terms,
		}
	);

	return existingPayload;
};
