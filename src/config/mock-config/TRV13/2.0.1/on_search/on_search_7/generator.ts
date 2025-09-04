export async function onSearch_7_Generator(existingPayload: any, sessionData: any) {
  delete existingPayload.context.bpp_uri;
  delete existingPayload.context.bpp_id;
  existingPayload.message.catalog = sessionData?.on_search_6_catalog ?? {};
  // existingPayload?.message?.catalog?.providers?.map((provider: any) => {
  //   provider.descriptor.code = sessionData?.search_1_descriptor_code ?? "HOTEL";
  // })
  // existingPayload.message.intent.payment.collected_by = sessionData.collected_by;
  // existingPayload.message.intent.fulfillment = sessionData.fulfillment;
  // existingPayload.message.intent.fulfillment.stops = sessionData.stops;
  // existingPayload.message.intent.tags = sessionData.tags;
  // existingPayload.message.intent.fulfillment.vehicle.category = sessionData.vehicle_category;
  return existingPayload;
} 