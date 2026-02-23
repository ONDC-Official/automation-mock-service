export async function onSearch_7_Generator(existingPayload: any, sessionData: any) {
  delete existingPayload.context.bpp_uri;
  delete existingPayload.context.bpp_id;

  existingPayload.message.catalog = sessionData?.on_search_6_catalog ?? {};

  return existingPayload;
} 