import { SessionData } from "../../session-types";


export async function searchMultipleStopsGenerator(existingPayload: any,sessionData: SessionData){
    delete existingPayload.context.bpp_uri
    delete existingPayload.context.bpp_id
    return existingPayload;
}