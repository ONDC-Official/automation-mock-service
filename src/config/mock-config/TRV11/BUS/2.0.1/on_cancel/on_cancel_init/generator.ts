import { onCancelHardGenerator } from "../on_cancel_hard/generator";
function stripTicketAuthorizations(order:any) {
    if (!order.fulfillments) return order;
  
    order.fulfillments = order.fulfillments.map((fulfillment:any) => {
      if (fulfillment.type === "TICKET") {
        return {
          ...fulfillment,
          stops: fulfillment.stops.map((stop:any) => {
            const { authorization, ...rest } = stop;
            return rest;
          })
        };
      }
      return fulfillment;
    });
  
    return order;
  }

export async function onCancelInitGenerator(existingPayload: any,sessionData: any){
    existingPayload = await onCancelHardGenerator(existingPayload,sessionData)
	existingPayload.message.order.status = "CANCELLATION_INITIATED"
    existingPayload.message.order = stripTicketAuthorizations(existingPayload.message.order)
    return existingPayload;
}