import { SessionData } from "../../session-types";
import { onUpdateMultipleStopsGenerator } from "./generator_multiple_stops";

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

export async function onUpdateUpdateFulfillmentGenerator(existingPayload: any,sessionData: SessionData){
    existingPayload = await onUpdateMultipleStopsGenerator(existingPayload,sessionData)
    updateFulfillmentStops(sessionData,existingPayload)
    return existingPayload;
}