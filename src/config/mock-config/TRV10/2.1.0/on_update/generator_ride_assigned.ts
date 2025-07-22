import { SessionData } from "../../session-types";
import { onUpdateMultipleStopsGenerator } from "./generator_multiple_stops";
const agent  = {
  "contact": {
      "phone": "9856798567"
  },
  "person": {
      "name": "Jason Roy"
  }
}
function updateFulfillmentStatus(order: any) {
    // Check if fulfillments exist
    if (order.fulfillments) {
      order.fulfillments.forEach((fulfillment: any) => {
          fulfillment.state.descriptor.code = "RIDE_ASSIGNED";
      });
    }
    return order;
  }

export async function onUpdateRideAssignedGenerator(existingPayload: any,sessionData: SessionData){
    existingPayload = await onUpdateMultipleStopsGenerator(existingPayload,sessionData)
    existingPayload.message.order = updateFulfillmentStatus(existingPayload.message.order)
    existingPayload.message.order.fulfillments[0]["agent"] = agent
    return existingPayload;
}