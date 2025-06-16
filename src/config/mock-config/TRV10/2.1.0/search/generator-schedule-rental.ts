
import { SessionData } from "../../session-types";

export async function searchMultipleStopsScheduleRentalGenerator(existingPayload: any,sessionData: SessionData){
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 6);
    existingPayload.message.intent.fulfillment.stops[0].time.timestamp = futureDate
    delete existingPayload.context.bpp_uri
    delete existingPayload.context.bpp_id
    return existingPayload;
}