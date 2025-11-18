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

function updateFulfillmentStops(sessionData: any, existingPayload: any) {
  if (!sessionData.update_stop) {
    console.error("No update_stop data found in session");
    return;
  }

  const { update_stop } = sessionData;

  // Loop through fulfillments and update the matching stop directly
  existingPayload.message.order.fulfillments.forEach((fulfillment: any) => {
    if (fulfillment.stops) {
      fulfillment.stops.forEach((stop: any) => {
        if (stop.type === update_stop.type) {
          Object.assign(stop, update_stop); // Directly modify stop
        }
      });
    }
  });
}

export async function onUpdateUpdateFulfillmentGenerator(
  existingPayload: any,
  sessionData: SessionData
) {
  existingPayload = await onUpdateMultipleStopsGenerator(
    existingPayload,
    sessionData
  );
  updateFulfillmentStops(sessionData, existingPayload);
  // UPDATE SETTLEMENT AMOUNT BASED ON QUOTE PRICE
  if (existingPayload.message.order.tags) {
    existingPayload.message.order.tags = updateSettlementAmount(
      existingPayload.message.order.tags,
      sessionData.quote
    );
  }
  return existingPayload;
}
