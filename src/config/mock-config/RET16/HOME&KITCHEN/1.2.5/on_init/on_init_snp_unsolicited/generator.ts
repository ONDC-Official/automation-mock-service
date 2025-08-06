import { SessionData } from "../../../../session-types";
import { getUpdatedBilling } from "../../api-objects/billing";
import { createFulfillments } from "../../api-objects/fulfillments";
import { removeItemQuantitiesFromQuote } from "../../api-objects/quote";

export async function on_init_snp_unsolicited_generator(
  existingPayload: any,
  sessionData: SessionData
) {
  console.log("###### on init_generator ####");
  existingPayload.message.order.items = sessionData.items;
  existingPayload.message.order.fulfillments = createFulfillments(
    "on_init",
    "on_init",
    sessionData,
    existingPayload.message.order.fulfillments
  );
  existingPayload.message.order.billing = getUpdatedBilling(
    sessionData.billing
  );
  console.log(
    "existingPayload",
    JSON.stringify(existingPayload)
  );

  existingPayload.message.order.payment.params.amount = existingPayload.message.order.quote.price.value;
  existingPayload.message.order.provider = sessionData.provider;
  existingPayload.message.order.quote = sessionData.quote;
  existingPayload.message.order.quote = removeItemQuantitiesFromQuote(sessionData.quote);
  return existingPayload;
}
