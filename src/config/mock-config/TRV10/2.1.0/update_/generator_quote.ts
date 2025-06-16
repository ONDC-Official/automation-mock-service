import { SessionData } from "../../session-types";
function updateQuoteWithAdditionalAmount(sessionData: any, updatePayload: any) {
    if (!sessionData.quote) {
      console.error("No quote data found in session");
      return updatePayload;
    }
  
    // Clone the quote object to avoid modifying session data directly
    const updatedQuote = { ...sessionData.quote };
  
    // Add the additional breakup at the end
    const additionalBreakup = {
      price: { currency: "INR", value: "20" },
      title: "BUYER_ADDITIONAL_AMOUNT"
    };
  
    updatedQuote.breakup = [...updatedQuote.breakup, additionalBreakup];
  
    // Calculate the updated total price by summing all breakup values
    const totalPrice = updatedQuote.breakup.reduce(
      (sum: any, item:any) => sum + parseFloat(item.price.value),
      0
    );
  
    // Update the total price in the quote
    updatedQuote.price = { currency: "INR", value: totalPrice.toString() };
  
    // Update the quote in the payload
    updatePayload.message.order.quote = updatedQuote;
  
    return updatePayload;
  }

export async function updateQuoteGenerator(existingPayload: any,sessionData: SessionData){
    existingPayload.message.order.id = sessionData.order_id
    existingPayload.message.update_target = "order.quote.breakup"
    delete existingPayload.message.order.fulfillments
    delete existingPayload.message.order.status
    existingPayload = updateQuoteWithAdditionalAmount(sessionData, existingPayload)
    console.log(existingPayload)
    return existingPayload;
}