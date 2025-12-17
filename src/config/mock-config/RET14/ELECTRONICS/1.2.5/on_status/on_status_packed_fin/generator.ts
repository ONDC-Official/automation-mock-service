import { SessionData } from "../../../../session-types";
import { getUpdatedBilling } from "../../api-objects/billing";
import { createFulfillments } from "../../api-objects/fulfillments";
import { createGenericOnStatus } from "../../api-objects/on_status";

export async function on_status_packed_fin_generator(
	existingPayload: any,
	sessionData: SessionData
) {
	const generalPayload = createGenericOnStatus(existingPayload, sessionData);
	generalPayload.message.order.fulfillments = createFulfillments(
		"on_status",
		"on_status_packed",
		sessionData,
		generalPayload.message.order.fulfillments
	);
	generalPayload.message.order.quote = sessionData.quote;
	generalPayload.message.order.payment = sessionData.payment;
	generalPayload.message.order.state = "In-progress"
	generalPayload.message.order.tags = (sessionData.order_tags || []).map(
    (tag: any) => {
      // remove accept_bap_terms from bpp_terms
      if (tag.code === "bpp_terms") {
        return {
          ...tag,
          list: tag.list.filter(
            (item: any) => item.code !== "accept_bap_terms"
          ),
        };
      }

      // remove static_terms from bap_terms
      if (tag.code === "bap_terms") {
        return {
          ...tag,
          list: tag.list.filter(
            (item: any) => item.code !== "static_terms"
          ),
        };
      }

      return tag;
    }
  );
	return generalPayload;
}
