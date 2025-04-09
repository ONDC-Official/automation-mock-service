import { SessionData } from "../../../../session-types";

export async function onStatusCancelGenerator(existingPayload: any,sessionData: SessionData){
    if (sessionData.updated_payments.length > 0) {
        existingPayload.message.order.payments = sessionData.updated_payments;
        existingPayload.message.order.payments[0].params.amount = sessionData.price
      }
    
    if (sessionData.items.length > 0) {
    existingPayload.message.order.items = sessionData.items;
    }

    if (sessionData.fulfillments.length > 0) {
    existingPayload.message.order.fulfillments = sessionData.fulfillments;
    }
    if (sessionData.order_id) {
    existingPayload.message.order.id = sessionData.order_id;
    }
    if(sessionData.quote != null){
    existingPayload.message.order.quote = sessionData.quote
    }
    const now = new Date().toISOString();
  	existingPayload.message.order.created_at = sessionData.created_at
  	existingPayload.message.order.updated_at = now
    existingPayload.message.order.status = "COMPLETE"
    return existingPayload;
}