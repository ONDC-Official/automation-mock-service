import { SessionData } from "../../session-types";

const customer = {
  contact: {
    phone: "9876556789",
  },
  person: {
    name: "Joe Adams",
  },
};

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

export async function onInitMultipleStopsGenerator(
  existingPayload: any,
  sessionData: SessionData
) {
  const randomPaymentId = Math.random().toString(36).substring(2, 15);

  if (sessionData.items.length > 0) {
    existingPayload.message.order.items = sessionData.items;
    existingPayload.message.order.items[0]["payment_ids"] = [randomPaymentId];
  }
  if (sessionData.selected_fulfillments.length > 0) {
    existingPayload.message.order.fulfillments =
      sessionData.selected_fulfillments;
    existingPayload.message.order.fulfillments[0]["customer"] = customer;
    // existingPayload.message.order.fulfillments[0]["type"] = "DELIVERY"
  }
  if (sessionData.payments.length > 0) {
    existingPayload.message.order.payments[0]["collected_by"] =
      sessionData.collected_by;
    existingPayload.message.order.payments[0]["id"] = randomPaymentId;
  }
  if (sessionData.quote != null) {
    existingPayload.message.order.quote = sessionData.quote;
  }
  existingPayload.message.order.provider.id = sessionData.provider_id;

  // UPDATE SETTLEMENT AMOUNT BASED ON QUOTE PRICE
  if (existingPayload.message.order.tags) {
    existingPayload.message.order.tags = updateSettlementAmount(
      existingPayload.message.order.tags,
      sessionData.quote
    );
  }
  return existingPayload;
}
