export async function onSearchSellerPagination1Generator(existingPayload: any, sessionData: any) {
    delete existingPayload.context.bpp_uri;
    delete existingPayload.context.bpp_id;
    // existingPayload.message.intent.payment.collected_by = sessionData.collected_by;
    // existingPayload.message.intent.fulfillment = sessionData.fulfillment;
    // existingPayload.message.intent.fulfillment.stops = sessionData.stops;
    // existingPayload.message.intent.tags = sessionData.tags;
    // existingPayload.message.intent.fulfillment.vehicle.category = sessionData.vehicle_category;
    return existingPayload;
  } 