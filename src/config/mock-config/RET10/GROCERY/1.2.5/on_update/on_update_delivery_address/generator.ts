import { SessionData } from "../../../../session-types";

export async function on_update_delivery_address(
  existingPayload: any,
  sessionData: SessionData
) {
  existingPayload.message.order.provider = sessionData.provider;
  existingPayload.message.order.id = sessionData.order_id;
  existingPayload.message.order.items = sessionData.items;
  existingPayload.message.order.billing = sessionData.billing;
  existingPayload.message.order.quote = sessionData.quote;
  existingPayload.message.order.fulfillments = sessionData.fulfillments;
  existingPayload.message.order.payment = sessionData.payment;
  existingPayload.message.order.created_at = sessionData.order_created_at;
  existingPayload.message.order.updated_at = new Date().toISOString()

  sessionData.update_fulfillments.forEach((update: any) => {
    const fulfillment: any = existingPayload.message.order.fulfillments.find(
      (f: any) => f.id === update.id
    );
  
    if (fulfillment && fulfillment.end) {
      if(update.end?.location){
        fulfillment.end.location = update.end.location;
      }
      if(update.end?.person){
        fulfillment.end.person = update.end.person;
      }
      if(update.end?.contact){
        fulfillment.end.contact = update.end.contact;
      }
    }
  });

  return existingPayload;
}

