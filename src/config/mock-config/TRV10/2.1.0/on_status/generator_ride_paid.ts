import { SessionData } from "../../session-types";
import { onStatusMultipleStopsGenerator } from "./generator_multiple_stops";


function updateFulfillmentStatus(order: any) {
  // Check if fulfillments exist
  if (order.fulfillments) {
    order.fulfillments.forEach((fulfillment: any) => {
        fulfillment.state.descriptor.code = "RIDE_ENDED";
    });
  }
  return order;
}

function updatePaymentFromQuote(order: any,transaction_id: any) {

    const amount = order.quote.price.value; // Extract amount from quote
    const randomPaymentId = Math.random().toString(36).substring(2, 15);
    if (order.payments) {
      order.payments.forEach((payment: any) => {
          payment.params = { 
            amount: amount ,
            transaction_id: randomPaymentId
          }; // Set amount from quote
          payment.status = "PAID"; // Change status to PAID
      });
    }
  
    return order;
  }
export async function onStatusRidePaidGenerator(existingPayload: any,sessionData: SessionData){
    existingPayload = await onStatusMultipleStopsGenerator(existingPayload,sessionData)
    existingPayload.message.order = updatePaymentFromQuote(existingPayload.message.order,sessionData.transaction_id)
    existingPayload.message.order = updateFulfillmentStatus(existingPayload.message.order)
    existingPayload.message.order.status = "COMPLETE"
    return existingPayload;
}