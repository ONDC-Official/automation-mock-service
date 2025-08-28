export async function onSearchIncrementalPull1Generator(
  existingPayload: any,
  sessionData: any
) {
  delete existingPayload.context.bpp_uri;
  delete existingPayload.context.bpp_id;

  const items = sessionData?.on_search_1_items[0] ?? [];
  sessionData.my_items=items;
  existingPayload.message.catalog.providers[0].id =
    sessionData?.on_search_1_provider_id ?? "P1";
  existingPayload.message.catalog.providers[0].items = items.splice(0, 1);
  // existingPayload.message.intent.payment.collected_by = sessionData.collected_by;
  // existingPayload.message.intent.fulfillment = sessionData.fulfillment;
  // existingPayload.message.intent.fulfillment.stops = sessionData.stops;
  // existingPayload.message.intent.tags = sessionData.tags;
  // existingPayload.message.intent.fulfillment.vehicle.category = sessionData.vehicle_category;
  return existingPayload;
}
