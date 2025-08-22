export async function onSearchSellerPagination1Generator(existingPayload: any, sessionData: any) {

    existingPayload.message.catalog.providers  =  existingPayload.message.catalog.providers.filter((provider: { id: any; })=>provider.id === sessionData.provider_id) 

    // NOTE: sessionData.items is NOT used here because page 1 contains no items
    // Items catalog starts from on_search_seller_pagination_2 and on_search_seller_pagination_3

    return existingPayload;
} 