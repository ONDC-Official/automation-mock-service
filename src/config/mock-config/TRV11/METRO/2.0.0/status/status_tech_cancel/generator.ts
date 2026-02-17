import { SessionData } from "../../../../session-types";


export async function statusTechCancelGenerator(existingPayload: any,sessionData: SessionData){
        existingPayload.message.ref_id = sessionData.transaction_id
        existingPayload.message.order_id = sessionData.transaction_id
    return existingPayload;
}