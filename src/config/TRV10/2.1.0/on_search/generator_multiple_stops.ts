import { SessionData } from "../../session-types";

export async function onSearchMultipleStopsGenerator(existingPayload: any, sessionData: SessionData) {
    for(let fulfillment of existingPayload.message.catalog.providers[0].fulfillments){
        fulfillment.stops = sessionData.stops
    }
    for (let payment of existingPayload.message.catalog.providers[0].payments){
        payment.collected_by = sessionData.collected_by
    }
    return existingPayload;
}