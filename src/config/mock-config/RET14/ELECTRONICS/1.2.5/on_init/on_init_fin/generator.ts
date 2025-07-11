import { title } from "process";
import { SessionData } from "../../../../session-types";
import { getUpdatedBilling } from "../../api-objects/billing";
import { createFulfillments } from "../../api-objects/fulfillments";
import { removeItemQuantitiesFromQuote } from "../../api-objects/quote";
import { getRandomItem } from "../../api-objects/utils";

export async function on_init_fin_generator(
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
  existingPayload.message.order.provider = sessionData.provider;
  existingPayload.message.order.quote = sessionData.quote;
  const itemId = existingPayload.message.order.items[0].id;
  existingPayload.message.order.quote.breakup.push({
    "@ondc/org/item_id": `${itemId}`,
    "@ondc/org/title_type": "offer",
    title:"offer",
    price: {
      currency: "INR",
      value: "0",
    },
    item: {
      tags: [
        {
          code: "quote",
          list: [
            {
              code: "type",
              value: "item",
            },
          ],
        },
        {
          code: "finance_terms",
          list: [
            {
              code: "subvention_type",
              value: "percent",
            },
            {
              code: "subvention_amount",
              value: "10.0",
            },
            {
              code: "provider_tax_number",
              value: "PAN_number",
            },
            {
              code: "bank_account_no",
              value: "bank_account_number",
            },
            {
              code: "ifsc_code",
              value: "ifsc_code",
            },
          ],
        },
      ],
    },
  });
  existingPayload.message.order.tags = sessionData.order_tags;
  existingPayload.message.order.quote = removeItemQuantitiesFromQuote(sessionData.quote);
  return existingPayload;
}
