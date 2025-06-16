import { SessionData } from "../../session-types";
import { onUpdateMultipleStopsGenerator } from "./generator_multiple_stops";

function updateFulfillmentStatus(order: any) {
    // Check if fulfillments exist
    if (order.fulfillments) {
      order.fulfillments.forEach((fulfillment: any) => {
          fulfillment.state.descriptor.code = "RIDE_STARTED";
      });
    }
    return order;
  }

export async function onUpdateRideUpdatedGenerator(existingPayload: any,sessionData: SessionData){
    existingPayload = await onUpdateMultipleStopsGenerator(existingPayload,sessionData)
    existingPayload.message.order = updateFulfillmentStatus(existingPayload.message.order)
    existingPayload.message.order.status = "UPDATED"
    if (sessionData.order_id) {
      existingPayload.message.order.id = sessionData.order_id;
    }
    return existingPayload;
}