import { SessionData } from "../../session-types";

export async function confirmGenerator(existingPayload: any,sessionData: SessionData){
    if (sessionData.billing && Object.keys(sessionData.billing).length > 0) {
        existingPayload.message.order.billing = sessionData.billing;
      }

    if (sessionData.selected_items && sessionData.selected_items.length > 0) {
    existingPayload.message.order.items = sessionData.selected_items;
    }
    if(sessionData.provider_id){
        existingPayload.message.order.provider.id = sessionData.provider_id
      }
    return existingPayload;
}