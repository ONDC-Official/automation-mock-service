import { SessionData } from "../../../session-types";

type Price = { value: string; currency: string };
type Item = { id: string; price: Price; quantity: { selected: { count: number } } };
type Breakup = { title: string; item?: Item; price: Price };
type Quote = { price: Price; breakup: Breakup[] };

function applyMerchantCancellation(quote: Quote): Quote {
    const currentTotal = parseFloat(quote.price.value);
    
    const refundBreakups: Breakup[] = quote.breakup
      .filter((b) => b.title === "BASE_FARE" && b.item)
      .map((baseFare) => ({
        title: "REFUND",
        item: {
          ...baseFare.item!,
          price: { ...baseFare.item!.price, value: `-${baseFare.item!.price.value}` }
        },
        price: { ...baseFare.price, value: `-${baseFare.price.value}` }
      }));
  
    const cancellationBreakup: Breakup = {
      title: "CANCELLATION_CHARGES",
      price: { currency: "INR", value: "0" }
    };
  
    return {
      price: { ...quote.price, value: "0" },
      breakup: [...quote.breakup, ...refundBreakups, cancellationBreakup]
    };
}

export async function onCancelGenerator(existingPayload: any, sessionData: SessionData) {
    const isMerchantCancel = sessionData.flowId === "MERCHANT_SIDE_CANCELLATION_FLOW";
    
    if (sessionData.updated_payments?.length > 0) {
        existingPayload.message.order.payments = sessionData.updated_payments;
    }
    
    if (sessionData.items?.length > 0) {
        existingPayload.message.order.items = sessionData.items;
    }
  
    if (sessionData.fulfillments?.length > 0) {
        existingPayload.message.order.fulfillments = sessionData.fulfillments;
    }
    
    if (sessionData.order_id) {
        existingPayload.message.order.id = sessionData.order_id;
    }
    
    if (sessionData.quote != null) {
        existingPayload.message.order.quote = isMerchantCancel 
            ? applyMerchantCancellation(sessionData.quote)
            : sessionData.quote;
    }
    
    if (isMerchantCancel && existingPayload.message.order.cancellation) {
        existingPayload.message.order.cancellation.cancelled_by = "PROVIDER";
        existingPayload.message.order.cancellation.reason = {
            id: "1",
            descriptor: { code: "SERVICE_UNAVAILABLE", name: "Service unavailable" }
        };
        existingPayload.message.order.cancellation.time = new Date().toISOString();
    }
    
    const now = new Date().toISOString();
    existingPayload.message.order.created_at = sessionData.created_at;
    existingPayload.message.order.updated_at = now;
    
    return existingPayload;
}
