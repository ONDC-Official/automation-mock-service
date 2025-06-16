
import { SessionData } from "../../session-types";

function updateSearchPayload(payload: any) {
    // Update category.descriptor.code
    payload.message.intent.category.descriptor.code = "ON_DEMAND_RENTAL";
  
    // Remove stop with type "END" from fulfillment.stops
    payload.message.intent.fulfillment.stops = payload.message.intent.fulfillment.stops.filter(
      (stop: any) => stop.type !== "END"
    );
  }
export async function searchMultipleStopsRentalGenerator(existingPayload: any,sessionData: SessionData){
    updateSearchPayload(existingPayload)
    delete existingPayload.context.bpp_uri
    delete existingPayload.context.bpp_id
    return existingPayload;
}