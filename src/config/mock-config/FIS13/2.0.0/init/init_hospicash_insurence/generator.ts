export async function initGenerator(existingPayload: any, sessionData: any) {
  // Use selected items from session (stored by select)
  if (sessionData.selected_items) {
    existingPayload.message.order.items = sessionData.selected_items;
  }
  
  // Use selected fulfillments from session (stored by select)
  if (sessionData.selected_fulfillments) {
    existingPayload.message.order.fulfillments = sessionData.fulfillments;
  }
  
  // Use selected provider from session (stored by select)
  if (sessionData.selected_provider) {
    existingPayload.message.order.provider = sessionData.selected_provider;
  }
  
 delete existingPayload.message.order.billing
 delete existingPayload.message.order.tags
  return existingPayload;
} 





