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
function generateToken(){
  return  Math.floor(100000 + Math.random() * 900000).toString();
}
function updateFulfillmentStatus(order: any) {
    // Check if fulfillments exist
    if (order.fulfillments) {
      order.fulfillments.forEach((fulfillment: any) => {
          fulfillment.state.descriptor.code = "RIDE_ASSIGNED";
          const startStop = fulfillment.stops.find((stop:any) => stop.type === "START");
          const endStop = fulfillment.stops.find((stop:any) => stop.type === "END");
          if (startStop) {
            const now = new Date();
            const newTime = new Date(now.getTime() + 15 * 60000).toISOString();
            startStop.time={
              timestamp: now.toISOString()
            }
            startStop.authorization = {
            token: generateToken(),
            type: "OTP",
            valid_to: newTime,
            status: "UNCLAIMED"
        };
      }
          if (endStop) {
            const now = new Date();
            const newTime = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString();
            endStop.authorization = {
            token: generateToken(),
            type: "OTP",
            valid_to: newTime,
            status: "UNCLAIMED"
        };}

          if(!fulfillment.vehicle.registration || !fulfillment.vehicle.make || !fulfillment.vehicle.model){
            fulfillment.vehicle.registration = "KA-01-AD-9876";
            fulfillment.vehicle.make = "Bajaj";
            fulfillment.vehicle.model = "Compact RE";
          }
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