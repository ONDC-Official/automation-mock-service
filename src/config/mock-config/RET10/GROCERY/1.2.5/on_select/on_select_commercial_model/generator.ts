import { SessionData } from "../../../../session-types";
import { createQuote } from "../../api-objects/breakup";
import { SelectedItems } from "../on_select/generator";

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

  sessionData.search_bap_terms ??= {};
  sessionData.search_bap_terms.list ??= ["00A"];


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