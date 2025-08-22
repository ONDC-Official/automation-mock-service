

export async function confirmDefaultGenerator(existingPayload: any, sessionData: any) {
  // Load items from session
  if (sessionData.selected_items) {
    existingPayload.message.order.items = sessionData.selected_items;
  }
  
  if (sessionData.fulfillments) {
    sessionData.fulfillments = sessionData.fulfillments.map((fulfillment: any) => {
      const { tags, ...rest } = fulfillment;
      return rest;
    });
  } 
  // Load provider from session
  if (sessionData.selected_provider) {
    existingPayload.message.order.provider = sessionData.selected_provider;
  }
  if (sessionData.payments) {
    sessionData.payments = sessionData.payments.map((payment: any) => {
      const { url, ...rest } = payment;
      return rest;
    });
  }
  

 
  delete existingPayload.message.order.tags
  return existingPayload;
} 