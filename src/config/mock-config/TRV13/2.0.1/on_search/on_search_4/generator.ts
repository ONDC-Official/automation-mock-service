export async function onSearch_4_Generator(
  existingPayload: any,
  sessionData: any
) {
  if (existingPayload.context) {
    existingPayload.context.bap_id = sessionData?.bap_id;
    existingPayload.context.bap_uri = sessionData?.bap_uri;
    if (existingPayload.context.location?.city) {
      existingPayload.context.location.city.code = sessionData?.city_code;
    }
  }
  existingPayload.message.catalog = sessionData?.on_search_3_catalog ?? {};
  existingPayload.message.catalog.tags.map((tag: any) => {
    tag.list.map((listItem: any) => {
      if (listItem.descriptor.code === "CURRENT_PAGE_NUMBER") {
        listItem.value = String(Number(listItem.value) + 1);
      }
    });
  });
  // existingPayload.message.catalog = sessionData?.on_search_1_catalog
  // existingPayload.message.intent.payment.collected_by = sessionData.collected_by;
  // existingPayload.message.intent.fulfillment = sessionData.fulfillment;
  // existingPayload.message.intent.fulfillment.stops = sessionData.stops;
  // existingPayload.message.intent.tags = sessionData.tags;
  // existingPayload.message.intent.fulfillment.vehicle.category = sessionData.vehicle_category;
  return existingPayload;
}
