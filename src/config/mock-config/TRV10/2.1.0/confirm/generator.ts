import { SessionData } from "../../session-types";

function updateSettlementAmount(terms: any[], quote: any) {
  const total = Number(quote?.price?.value || 0);

  terms.forEach((termBlock) => {
    if (!termBlock.list) return;

    const buyerFeeItem =
      termBlock.list.find(
        (i: any) => i.descriptor?.code === "BUYER_FINDER_FEES_PERCENTAGE",
      ) || 1;
    const settlementItem = termBlock.list.find(
      (i: any) => i.descriptor?.code === "SETTLEMENT_AMOUNT",
    );

    if (buyerFeeItem && settlementItem) {
      const percentage = Number(buyerFeeItem.value || 0);
      const settlementAmount = ((total * percentage) / 100).toFixed(2);
      settlementItem.value = settlementAmount;
    }
  });

  return terms;
}

export async function confirmGenerator(
  existingPayload: any,
  sessionData: SessionData,
) {
  if (sessionData.billing && Object.keys(sessionData.billing).length > 0) {
    existingPayload.message.order.billing = sessionData.billing;
  }

  if (sessionData.selected_items && sessionData.selected_items.length > 0) {
    existingPayload.message.order.items = sessionData.selected_items;
  }
  if (sessionData.provider_id) {
    existingPayload.message.order.provider.id = sessionData.provider_id;
  }
  delete existingPayload.message.order.fulfillments[0].type;

  // UPDATE SETTLEMENT AMOUNT BASED ON QUOTE PRICE
  // if (existingPayload.message.order.tags) {
  //   existingPayload.message.order.tags = updateSettlementAmount(
  //     existingPayload.message.order.tags,
  //     sessionData.quote
  //   );
  // }
  existingPayload.message.order.tags = [
    ...(sessionData as any)?.init_tags?.flat(),
    ...(sessionData as any)?.on_init_tags?.flat(),
  ];
  return existingPayload;
}
