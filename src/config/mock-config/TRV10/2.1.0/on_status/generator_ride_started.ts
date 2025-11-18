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

function updateFulfillmentAndAuthorization(order: any) {
  // Update fulfillment state to RIDE_STARTED
  if (order.fulfillments) {
    order.fulfillments.forEach((fulfillment: any) => {
      if (fulfillment.state?.descriptor?.code) {
        fulfillment.state.descriptor.code = "RIDE_STARTED";
      }

      // Find stop with type START and update authorization status
      fulfillment.stops?.forEach((stop: any) => {
        if (stop.authorization && stop.type === "START") {
          stop.authorization.status = "CLAIMED";
        }
      });
    });
  }

  return order;
}

export async function onStatusRideStartedGenerator(
  existingPayload: any,
  sessionData: SessionData
) {
  existingPayload = await onStatusMultipleStopsGenerator(
    existingPayload,
    sessionData
  );
  existingPayload.message.order = updateFulfillmentAndAuthorization(
    existingPayload.message.order
  );
  // UPDATE SETTLEMENT AMOUNT BASED ON QUOTE PRICE
  if (existingPayload.message.order.tags) {
    existingPayload.message.order.tags = updateSettlementAmount(
      existingPayload.message.order.tags,
      sessionData.quote
    );
  }
  return existingPayload;
}
