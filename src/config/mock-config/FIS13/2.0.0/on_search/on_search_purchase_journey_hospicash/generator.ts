export async function onSearchSellerPagination1Generator(existingPayload: any, sessionData: any) {

    existingPayload.message.catalog.providers  =  existingPayload.message.catalog.providers.filter((provider: { id: any; })=>provider.id === sessionData.provider_id) 
    return existingPayload;
} 