import { SessionData } from "../../../../session-types";
import { createQuote } from "../../api-objects/breakup";
import { SelectedItems } from "../on_select/generator";

interface BapTerm {
	code: string;
	value: string;
}
export async function on_select_commercial_model_generator(
  existingPayload: any,
  sessionData: SessionData
) {
  const selectedItemsObj = sessionData.selected_items as SelectedItems;

  existingPayload.message.order.items = selectedItemsObj.map((item) => {
    return {
      id: item.id,
      fulfillment_id: "F1",
    };
  });

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

  const quote = createQuote(
    selectedItemsObj.map((item) => {
      return {
        id: item.id,
        count: item.quantity.count,
        fulfillment_id: "F1",
      };
    }),
    sessionData,
    existingPayload,
    existingPayload.message.order.fulfillments
  );

  existingPayload.message.order.quote = quote;
  return existingPayload;
}