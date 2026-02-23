export async function onSearch_6_Generator(existingPayload: any, sessionData: any) {
  delete existingPayload.context.bpp_uri;
  delete existingPayload.context.bpp_id;

  if (existingPayload?.message?.catalog?.providers?.[0]?.time) {
    existingPayload.message.catalog.providers[0].time.timestamp = new Date().toISOString();
  }

  return existingPayload;
} 