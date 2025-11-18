import { SessionData } from "../../session-types";

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

export async function onUpdateMultipleStopsGenerator(
  existingPayload: any,
  sessionData: SessionData
) {
  if (sessionData.payments.length > 0) {
    existingPayload.message.order.payments = sessionData.payments;
  }

  if (sessionData.items.length > 0) {
    existingPayload.message.order.items = sessionData.items;
  }

  if (sessionData.fulfillments.length > 0) {
    existingPayload.message.order.fulfillments =
      sessionData.selected_fulfillments;
    existingPayload.message.order.fulfillments[0]["type"] = "DELIVERY";

    const fulfillments = existingPayload.message.order.fulfillments;

    existingPayload.message.order.fulfillments = fulfillments.map(
      (fulfillment: any, index: number) => {
        fulfillment.id =
          sessionData?.selected_fulfillments[index]?.id || index + 1;
        fulfillment.vehicle = {
          ...fulfillment.vehicle,
        };
        return fulfillment;
      }
    );
  }
  if (sessionData.order_id) {
    existingPayload.message.order.id = sessionData.order_id;
  }
  if (sessionData.quote != null) {
    existingPayload.message.order.quote = sessionData.quote;
  }
  const now = new Date().toISOString();
  existingPayload.message.order.created_at = sessionData.created_at;
  existingPayload.message.order.updated_at = existingPayload.context.timestamp;
  if (sessionData.payments.length > 0) {
    existingPayload.message.order.payments = sessionData.payments;
  }

  // UPDATE SETTLEMENT AMOUNT BASED ON QUOTE PRICE
  if (existingPayload.message.order.tags) {
    existingPayload.message.order.tags = updateSettlementAmount(
      existingPayload.message.order.tags,
      sessionData.quote
    );
  }
  return existingPayload;
}
