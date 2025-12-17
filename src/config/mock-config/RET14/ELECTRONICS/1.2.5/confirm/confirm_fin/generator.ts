import { SessionData } from "../../../../session-types";
import { getUpdatedBilling } from "../../api-objects/billing";
import { createFulfillments } from "../../api-objects/fulfillments";
export async function confirm_fin_generator(
  existingPayload: any,
  sessionData: SessionData
) {
  const timeIso = new Date().toISOString();

  existingPayload.message.order.id = generateSixDigitCode();
  existingPayload.message.order.created_at = existingPayload.context.timestamp;
  existingPayload.message.order.updated_at = existingPayload.context.timestamp;
  existingPayload.message.order.quote = sessionData.quote;
  existingPayload.message.order.billing = getUpdatedBilling(
    sessionData.billing
  );
  existingPayload.message.order.items = sessionData.items;
  existingPayload.message.order.provider = sessionData.provider;
  existingPayload.message.order.payment = sessionData.payment;
  existingPayload.message.order.fulfillments = createFulfillments(
    "confirm",
    "confirm",
    sessionData,
    existingPayload.message.order.fulfillments
  );

  const itemId = existingPayload.message.order.items[0].id;
  // existingPayload.message.order.tags = sessionData.order_tags || [];
  const tags = sessionData.order_tags;

  const bapTerms = tags.find((t: any) => t.code === "bap_terms");

  if (bapTerms) {
    bapTerms.list.push(
      {
        code: "accept_bpp_terms",
        value: "Y",
      },
      {
        code: "static_terms",
        value:
          "https://github.com/ONDC-Official/NP-Static-Terms/buyerNP_BNP/1.0/tc.pdf",
      }
    );
  }

  existingPayload.message.order.tags = tags;

  console.log("🚀 ~ confirm_fin_generator ~ sessionData.order_tags:", sessionData.order_tags)
  let extractedOfferItem: any = null;

  existingPayload.message.order.quote.breakup =
    existingPayload.message.order.quote.breakup.filter((item: any) => {
      const isOfferItem =
        item["@ondc/org/item_id"] == `${itemId}` &&
        item["@ondc/org/title_type"] == "offer";

      if (isOfferItem) {
        extractedOfferItem = item;
        return false;
      }
      return true;
    });
  console.log("extractedOfferItem", JSON.stringify(extractedOfferItem));
  extractedOfferItem.item.tags.push({
    code: "finance_txn",
    list: [
      {
        code: "loan_completed",
        value: "yes",
      },
      {
        code: "down_payment",
        value: "1000.00",
      },
      {
        code: "loan_amount",
        value: "9000.00",
      },
      {
        code: "loan_provider",
        value: "PAN_number",
      },
      {
        code: "transaction_id",
        value: "txid1234"
      },
      {
        code: "timestamp",
        value: timeIso,
      },
    ],
  });
  existingPayload.message.order.quote.breakup.push(extractedOfferItem);

  return existingPayload;
}
export function generateSixDigitCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
