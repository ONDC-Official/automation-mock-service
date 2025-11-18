import { SessionData } from "../../../session-types";

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

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

export async function onCancelSoftGenerator(
  existingPayload: any,
  sessionData: SessionData
) {
  if (sessionData.payments.length > 0) {
    existingPayload.message.order.payments = sessionData.payments;
  }
  existingPayload.message.order.cancellation.reason.descriptor.code =
    sessionData.cancellation_reason_id;
  if (sessionData.items.length > 0) {
    existingPayload.message.order.items = sessionData.items;
  }

  if (sessionData.fulfillments.length > 0) {
    existingPayload.message.order.fulfillments =
      sessionData.selected_fulfillments;
  }

  if (sessionData.order_id) {
    existingPayload.message.order.id = sessionData.order_id;
  }
  if (sessionData.quote != null) {
    existingPayload.message.order.quote = sessionData.quote;
  }
  let quote = existingPayload.message.order.quote;
  console.log("existingPayload--", JSON.stringify(existingPayload));
  const refund_price = existingPayload.message.order.quote?.price?.value;
  quote.breakup.push(
    {
      title: "CANCELLATION_CHARGES",
      price: {
        currency: "INR",
        value: "10",
      },
    },
    {
      title: "REFUND",
      price: {
        currency: "INR",
        value: String("-" + refund_price),
      },
    }
  );
  existingPayload.message.order.quote.price = { currency: "INR", value: "10" };
  const now = new Date().toISOString();
  existingPayload.message.order.created_at = sessionData.created_at;
  existingPayload.message.order.updated_at = existingPayload.context.timestamp;

  // UPDATE SETTLEMENT AMOUNT BASED ON QUOTE PRICE
  if (existingPayload.message.order.tags) {
    existingPayload.message.order.tags = updateSettlementAmount(
      existingPayload.message.order.tags,
      sessionData.quote
    );
  }
  return existingPayload;
}
