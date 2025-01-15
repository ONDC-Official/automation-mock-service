
export async function confirmGenerator(existingPayload: any,sessionData: any){
    if (sessionData.billing && Object.keys(sessionData.billing).length > 0) {
        existingPayload.message.order.billing = sessionData.billing;
      }

    if (sessionData.items && sessionData.items.length > 0) {
    existingPayload.message.order.items = sessionData.items;
    }
    if(sessionData.provider_id){
        existingPayload.message.order.provider.id = sessionData.provider_id
      }
    return existingPayload;
}