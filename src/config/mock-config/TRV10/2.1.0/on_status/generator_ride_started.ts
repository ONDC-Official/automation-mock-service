import { SessionData } from "../../session-types";
import { onStatusMultipleStopsGenerator } from "./generator_multiple_stops";

function updateFulfillmentAndAuthorization(order: any) {
    // Update fulfillment state to RIDE_STARTED
    if (order.fulfillments) {
      order.fulfillments.forEach((fulfillment: any) => {
        if (fulfillment.state?.descriptor?.code) {
          fulfillment.state.descriptor.code = "RIDE_STARTED";
        }
  
        // Find stop with type START and update authorization status
        fulfillment.stops?.forEach((stop: any) => {
          if (stop.authorization) {
            stop.authorization.status = "CLAIMED";
          }
        });
      });
    }
  
    return order;
  }

export async function onStatusRideStartedGenerator(existingPayload: any,sessionData: SessionData){
    existingPayload = await onStatusMultipleStopsGenerator(existingPayload,sessionData)
    existingPayload.message.order = updateFulfillmentAndAuthorization(existingPayload.message.order)
    return existingPayload;
}