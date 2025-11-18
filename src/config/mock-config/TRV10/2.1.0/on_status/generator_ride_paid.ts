import { SessionData } from "../../session-types";
import { onStatusMultipleStopsGenerator } from "./generator_multiple_stops";

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

function updateFulfillmentStatus(order: any) {
  // Check if fulfillments exist
  if (order.fulfillments) {
    order.fulfillments.forEach((fulfillment: any) => {
      fulfillment.state.descriptor.code = "RIDE_ENDED";
    });
  }
  return order;
}

function updatePaymentFromQuote(order: any, transaction_id: any) {
  const amount = order.quote.price.value; // Extract amount from quote
  const randomPaymentId = Math.random().toString(36).substring(2, 15);
  if (order.payments) {
    order.payments.forEach((payment: any) => {
      payment.params = {
        amount: amount,
        transaction_id: randomPaymentId,
      }; // Set amount from quote
      payment.status = "PAID"; // Change status to PAID
    });
  }

  return order;
}
export async function onStatusRidePaidGenerator(
  existingPayload: any,
  sessionData: SessionData
) {
  existingPayload = await onStatusMultipleStopsGenerator(
    existingPayload,
    sessionData
  );
  existingPayload.message.order = updatePaymentFromQuote(
    existingPayload.message.order,
    sessionData.transaction_id
  );
  existingPayload.message.order = updateFulfillmentStatus(
    existingPayload.message.order
  );
  // UPDATE SETTLEMENT AMOUNT BASED ON QUOTE PRICE
  if (existingPayload.message.order.tags) {
    existingPayload.message.order.tags = updateSettlementAmount(
      existingPayload.message.order.tags,
      sessionData.quote
    );
  }
  existingPayload.message.order.status = "COMPLETE";
  return existingPayload;
}
