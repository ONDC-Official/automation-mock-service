import { SessionData } from "../../session-types";

export async function onTrackMultipleStopsGenerator(existingPayload: any,sessionData: SessionData){
    const now = new Date().toISOString();
    existingPayload.message.tracking.location.updated_at = now
    return existingPayload;
}