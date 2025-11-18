import { SessionData } from "../../session-types";
import { onUpdateMultipleStopsGenerator } from "./generator_multiple_stops";

function updateSettlementAmount(terms: any[], quote: any) {
  const total = Number(quote?.price?.value || 0);

  terms.forEach((termBlock) => {
    if (!termBlock.list) return;

    const buyerFeeItem =
      termBlock.list.find(
        (i: any) => i.descriptor?.code === "BUYER_FINDER_FEES_PERCENTAGE"
      ) || 1;
    const settlementItem = termBlock.list.find(
      (i: any) => i.descriptor?.code === "SETTLEMENT_AMOUNT"
    );

    if (buyerFeeItem && settlementItem) {
      const percentage = Number(buyerFeeItem.value || 0);
      const settlementAmount = ((total * percentage) / 100).toFixed(2);
      settlementItem.value = settlementAmount;
    }
  });

  return terms;
}

export async function onUpdateUpdateQuoteGenerator(
  existingPayload: any,
  sessionData: SessionData
) {
  existingPayload = await onUpdateMultipleStopsGenerator(
    existingPayload,
    sessionData
  );
  if (sessionData.quote != null) {
    if (Array.isArray(sessionData.update_quote)) {
      existingPayload.message.order.quote = sessionData.update_quote[0] || {}; // Assign first element or an empty object
    } else {
      existingPayload.message.order.quote = sessionData.update_quote;
    }
  }
  existingPayload.message.order.id = sessionData.order_id;
  existingPayload.message.order.items[0].price.value =
    sessionData.updated_price;
  existingPayload.message.order.status = "COMPLETE";
  // UPDATE SETTLEMENT AMOUNT BASED ON QUOTE PRICE
  if (existingPayload.message.order.tags) {
    existingPayload.message.order.tags = updateSettlementAmount(
      existingPayload.message.order.tags,
      sessionData.quote
    );
  }
  return existingPayload;
}
