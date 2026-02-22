export async function onSearch_1_Generator(existingPayload: any, sessionData: any) {
  // existingPayload?.message?.catalog?.providers?.map((provider: any) => {
  //   provider.descriptor.code = sessionData?.search_1_descriptor_code ?? "HOTEL";
  // })
  // existingPayload.message.intent.payment.collected_by = sessionData.collected_by;
  // existingPayload.message.intent.fulfillment = sessionData.fulfillment;
  // existingPayload.message.intent.fulfillment.stops = sessionData.stops;
  // existingPayload.message.intent.tags = sessionData.tags;
  // existingPayload.message.intent.fulfillment.vehicle.category = sessionData.vehicle_category;

  if (existingPayload?.message?.catalog?.providers?.[0]?.time) {
    existingPayload.message.catalog.providers[0].time.timestamp = new Date().toISOString();
  }

  return existingPayload;
} 