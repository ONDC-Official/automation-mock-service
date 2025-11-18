import { SessionData } from "../../session-types";
import { onConfirmMultipleStopsGenerator } from "./on_confirm_driver_assigned/generator_multiple_stops";

function updateFulfillmentStatus(order: any) {
  // Check if fulfillments exist
  if (order.fulfillments) {
    order.fulfillments.forEach((fulfillment: any) => {
      fulfillment.state.descriptor.code = "RIDE_CONFIRMED";
      fulfillment.vehicle = {
        category: fulfillment.vehicle.category,
        variant: fulfillment.vehicle.variant,
      };
    });
  }
  return order;
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
export async function onConfirmMultipleStopsRentalGenerator(
  existingPayload: any,
  sessionData: SessionData
) {
  existingPayload = await onConfirmMultipleStopsGenerator(
    existingPayload,
    sessionData
  );
  existingPayload.message.order = updateFulfillmentStatus(
    existingPayload.message.order
  );
  delete existingPayload.message.order.fulfillments[0]["agent"];
  existingPayload.message.order.fulfillments[0].stops =
    existingPayload.message.order.fulfillments[0].stops.map((stop: any) => {
      const { authorization, ...rest } = stop;
      return rest;
    });

  // UPDATE SETTLEMENT AMOUNT BASED ON QUOTE PRICE
  if (existingPayload.message.order.tags) {
    existingPayload.message.order.tags = updateSettlementAmount(
      existingPayload.message.order.tags,
      sessionData.quote
    );
  }
  return existingPayload;
}
