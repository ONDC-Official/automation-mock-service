import { SessionData } from "../../session-types";
import { onUpdateMultipleStopsGenerator } from "./generator_multiple_stops";

function updateStops(onUpdatePayload: any, updateStop: any) {
  // Loop through fulfillments
  onUpdatePayload.message.order.fulfillments.forEach((fulfillment: any) => {
    if (fulfillment?.stops && Array.isArray(fulfillment.stops)) {
      // Find the stop that matches the type in update_stop
      const stopToUpdate = fulfillment.stops.find(
        (stop: any) => stop.type === updateStop.type
      );
      console.log(updateStop);
      if (stopToUpdate) {
        // Update stop properties
        // stopToUpdate.location = updateStop.location;
        stopToUpdate.id = updateStop.id;
        stopToUpdate.parent_stop_id = updateStop.parent_stop_id;
      }
    }
  });

  return onUpdatePayload;
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

function updateFulfillmentStatus(order: any) {
  // Check if fulfillments exist
  if (order.fulfillments) {
    order.fulfillments.forEach((fulfillment: any) => {
      fulfillment.state.descriptor.code = "RIDE_STARTED";
    });
  }
  return order;
}

export async function onUpdateRideSoftUpdateGenerator(
  existingPayload: any,
  sessionData: SessionData
) {
  existingPayload = await onUpdateMultipleStopsGenerator(
    existingPayload,
    sessionData
  );
  if (existingPayload.fulfillments) {
    existingPayload.message.order = updateFulfillmentStatus(
      existingPayload.message.order
    );
  }

  existingPayload.message.order.status = "SOFT_UPDATE";
  console.log("the updated stop is ", sessionData.update_stop);
  existingPayload = updateStops(existingPayload, sessionData.update_stop[0]);
  for (const fulfillment of existingPayload.message.order.fulfillments) {
    for (const stop of fulfillment.stops) {
      delete stop.parent_stop_id;
    }
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
