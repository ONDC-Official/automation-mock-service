import { SessionData } from "../../session-types";
import { onConfirmMultipleStopsGenerator } from "./on_confirm_driver_assigned/generator_multiple_stops";

function updateFulfillmentStatus(order: any) {
    // Check if fulfillments exist
    if (order.fulfillments) {
      order.fulfillments.forEach((fulfillment: any) => {
          fulfillment.state.descriptor.code = "RIDE_CONFIRMED";
      });
    }
    return order;
  }
export async function onConfirmMultipleStopsRentalGenerator(existingPayload: any,sessionData: SessionData){
    existingPayload = await onConfirmMultipleStopsGenerator(existingPayload,sessionData)
    existingPayload.message.order = updateFulfillmentStatus(existingPayload.message.order)
    delete existingPayload.message.order.fulfillments[0]["agent"]
    return existingPayload;
}