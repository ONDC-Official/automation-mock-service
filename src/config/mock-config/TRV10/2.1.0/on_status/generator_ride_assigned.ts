import { SessionData } from "../../session-types";
import { onStatusMultipleStopsGenerator } from "./generator_multiple_stops";

function updateFulfillmentStatus(order: any) {
    // Check if fulfillments exist
    if (order.fulfillments) {
      order.fulfillments.forEach((fulfillment: any) => {
          fulfillment.state.descriptor.code = "RIDE_ASSIGNED";
      });
    }
    return order;
  }

export async function onStatusRideAssignedGenerator(existingPayload: any,sessionData: SessionData){
    existingPayload = await onStatusMultipleStopsGenerator(existingPayload,sessionData)
    existingPayload.message.order = updateFulfillmentStatus(existingPayload.message.order)
    return existingPayload;
}