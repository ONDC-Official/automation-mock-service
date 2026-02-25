export async function onSearch_1_Generator(existingPayload: any, sessionData: any) {
  // existingPayload?.message?.catalog?.providers?.map((provider: any) => {
  //   provider.descriptor.code = sessionData?.search_1_descriptor_code ?? "HOTEL";
  // })
  // existingPayload.message.intent.payment.collected_by = sessionData.collected_by;
  // existingPayload.message.intent.fulfillment = sessionData.fulfillment;
  // existingPayload.message.intent.fulfillment.stops = sessionData.stops;
  // existingPayload.message.intent.tags = sessionData.tags;
  // existingPayload.message.intent.fulfillment.vehicle.category = sessionData.vehicle_category;

  const currentTimestamp = new Date().toISOString();
  const endTimestamp = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();

  if (existingPayload?.message?.catalog?.providers?.[0]?.time) {
    existingPayload.message.catalog.providers[0].time.timestamp = currentTimestamp;
  }

  existingPayload?.message?.catalog?.providers?.forEach((provider: any) => {
    provider.items?.forEach((item: any) => {
      if (item.time) {
        item.time.timestamp = currentTimestamp;
        if (item.time.range) {
          item.time.range.start = currentTimestamp;
          item.time.range.end = endTimestamp;
        }
      }
    });
  });

  return existingPayload;
} 