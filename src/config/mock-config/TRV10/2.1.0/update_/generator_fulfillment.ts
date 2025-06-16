import { SessionData } from "../../session-types";

function updateStop(updatePayload: any, anotherAPIResponse: any) {
    // Extract the stop from update payload
    const updateStop = updatePayload.message.order.fulfillments[0]?.stops[0];
    
    if (!updateStop) {
      console.error("No stop found in update payload");
      return anotherAPIResponse;
    }
  
    const stopType = updateStop.type; // Extract stop type
    
    // Find and update the matching stop in another API response
    anotherAPIResponse.message.order.fulfillments.forEach((fulfillment: any) => {
      fulfillment.stops.forEach((stop: any) => {
        if (stop.type === stopType) {
          stop.location = updateStop.location; // Update location
          stop.parent_stop_id = updateStop.parent_stop_id; // Update parent stop ID
        }
      });
    });
  
    return anotherAPIResponse;
  }

export async function updateFulfillmentSoftGenerator(existingPayload: any,sessionData: SessionData){
    existingPayload.message.order.id = sessionData.order_id
    existingPayload.message.order.fulfillments[0].id = sessionData.selected_fulfillment_id
    return existingPayload;
}