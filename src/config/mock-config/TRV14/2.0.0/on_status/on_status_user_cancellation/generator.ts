export async function onStatusUserCancellationGenerator(existingPayload: any, sessionData: any) {
  delete existingPayload.context.bpp_uri;
  delete existingPayload.context.bpp_id;
  return existingPayload;
} 