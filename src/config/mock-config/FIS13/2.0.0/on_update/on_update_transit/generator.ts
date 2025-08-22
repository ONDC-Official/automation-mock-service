/**
 * Super Simplified Select Generator for TRV14
 * 
 * Logic:
 * 1. Select the 0th index item from sessionData.items
 * 2. Always use quantity count = 1 for both item and add-ons
 * 3. Include add-ons if they exist on the selected item
 * 4. Use 0th index fulfillment from item's fulfillment_ids
 * 5. Use provider_id from session data
 * 6. Update fulfillment timestamps to match context timestamp
 */

/**
 * Creates item payload with quantity and add-ons
 * @param selectedItem - The item object from sessionData.items
 * @returns Formatted item payload for the select request
 */


export async function selectDefaultGenerator(existingPayload: any, sessionData: any) {

  // Update the payload with only the selected item
  existingPayload.message.order.id = sessionData.order_id;
  existingPayload.message.order.status = sessionData.order_status;
  existingPayload.message.order.items = sessionData.items
  existingPayload.message.order.provider = sessionData.provider
  existingPayload.message.order.quote = sessionData.quote
  existingPayload.message.order.fulfillments = sessionData.fulfillments.map((item :{
    [x: string]: any;type:any
})=>{
        item.state.descriptor.code = "GRANTED"
         return item;
  })

  existingPayload.message.order.cancellation_terms = [sessionData.cancellation_terms]
  existingPayload.message.order.payments = sessionData.payments

  if (sessionData.created_at) {
    existingPayload.message.order.created_at = sessionData.created_at;
  }
  existingPayload.message.order.updated_at = sessionData.created_at;


 

  return existingPayload;
} 

