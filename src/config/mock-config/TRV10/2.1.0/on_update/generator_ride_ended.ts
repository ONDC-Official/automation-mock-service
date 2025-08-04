import { SessionData } from "../../session-types";
import { onUpdateMultipleStopsGenerator } from "./generator_multiple_stops";

function updateFulfillmentStatus(order: any) {
    // Check if fulfillments exist
    if (order.fulfillments) {
      order.fulfillments.forEach((fulfillment: any) => {
          fulfillment.state.descriptor.code = "RIDE_ENDED";

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

export async function onUpdateRideEndedGenerator(existingPayload: any,sessionData: SessionData){
    existingPayload = await onUpdateMultipleStopsGenerator(existingPayload,sessionData)
    existingPayload.message.order = updateFulfillmentStatus(existingPayload.message.order)
    return existingPayload;
}