import { SessionData } from "../../session-types";

function updateSearchPayload(payload: any) {
    // Update category.descriptor.code
    payload.message.intent.category.descriptor.code = "ON_DEMAND_RENTAL";
  }
export async function searchMultipleStopsRentalEndGenerator(existingPayload: any,sessionData: SessionData){
    updateSearchPayload(existingPayload)
    return existingPayload;
}